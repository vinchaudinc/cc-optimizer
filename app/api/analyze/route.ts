export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Papa from "papaparse";
import OpenAI from "openai";
import {
  type AnalysisPeriod,
  buildAnalysisResponse,
  normalizeTransactions,
  type Transaction,
} from "@/app/lib/recommendations";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function extractTextFromPDF(uint8Array: Uint8Array) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const globalScope = globalThis as typeof globalThis & {
    pdfjsWorker?: { WorkerMessageHandler?: unknown };
  };

  // Next.js server chunks can fail to resolve default workerSrc ("./pdf.worker.mjs").
  // Preloading the worker module here gives PDF.js a main-thread worker handler.
  if (!globalScope.pdfjsWorker?.WorkerMessageHandler) {
    const workerModule = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    globalScope.pdfjsWorker = workerModule;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    useSystemFonts: true,
    disableFontFace: true,
  });

  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const parts: string[] = [];

    for (const item of content.items) {
      if (typeof item !== "object" || item === null || !("str" in item)) {
        continue;
      }

      const text = String((item as { str: unknown }).str);
      const hasEOL =
        "hasEOL" in item &&
        Boolean((item as { hasEOL?: unknown }).hasEOL === true);

      if (text) parts.push(text);
      parts.push(hasEOL ? "\n" : " ");
    }

    fullText += parts.join("").replace(/[ \t]+\n/g, "\n") + "\n";
  }

  return fullText;
}

function parseJsonArray(text: string): unknown[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];
    if (!fenced) return [];
    try {
      return JSON.parse(fenced);
    } catch {
      return [];
    }
  }
}

function toIsoDate(value: string): string | null {
  const m = value.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
  if (!m) return null;

  const month = Number(m[1]);
  const day = Number(m[2]);
  let year = m[3] ? Number(m[3]) : new Date().getFullYear();
  if (year < 100) year += 2000;

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return `${String(year).padStart(4, "0")}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
}

function extractTransactionsHeuristic(text: string): Transaction[] {
  const linePattern =
    /\b(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)\b\s+(.+?)\s+(\(?-?\$?\d[\d,]*\.\d{2}\)?)/;

  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const out: Transaction[] = [];
  for (const line of rows) {
    const match = line.match(linePattern);
    if (!match) continue;

    const iso = toIsoDate(match[1]);
    if (!iso) continue;

    const description = match[2].replace(/\s+/g, " ").trim();
    let amountRaw = match[3].replace(/[$,]/g, "").trim();
    const isParenNegative = amountRaw.startsWith("(") && amountRaw.endsWith(")");
    amountRaw = amountRaw.replace(/[()]/g, "");

    let amount = Number(amountRaw);
    if (!Number.isFinite(amount)) continue;
    if (isParenNegative && amount > 0) amount = -amount;
    if (!amountRaw.startsWith("-") && !isParenNegative) amount = -Math.abs(amount);

    out.push({ date: iso, description, amount });
  }

  return out;
}

function buildTransactionFocusedText(text: string): string {
  const amountRegex = /[$]?\d[\d,]*\.\d{2}/;
  const dateRegex = /\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/;

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const candidates = lines.filter(
    (line) => amountRegex.test(line) && dateRegex.test(line)
  );

  if (candidates.length >= 10) {
    return candidates.join("\n").slice(0, 22000);
  }

  if (text.length <= 22000) return text;
  const head = text.slice(0, 11000);
  const tail = text.slice(-11000);
  return `${head}\n...\n${tail}`;
}

async function extractTransactionsWithAI(text: string): Promise<Transaction[]> {
  const focusedText = buildTransactionFocusedText(text);

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "You extract bank transactions from statements.",
      },
      {
        role: "user",
        content: `
Extract bank transactions from the text below.

Return ONLY JSON.

Format:
[
  {
    "date": "YYYY-MM-DD",
    "description": "string",
    "amount": number
  }
]

Rules:
- spending = negative numbers
- income = positive numbers
- ignore totals, balances, headers
- if a line is clearly a transaction, include it even when formatting is messy

TEXT:
${focusedText}
`,
      },
    ],
  });

  const json = response.choices[0].message.content || "[]";
  const aiTransactions = normalizeTransactions(parseJsonArray(json));
  if (aiTransactions.length > 0) return aiTransactions;

  return extractTransactionsHeuristic(text);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const periodValue = formData.get("period");
    const period: AnalysisPeriod =
      periodValue === "monthlyStatement" ? "monthlyStatement" : "annualSummary";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uint8Array = new Uint8Array(arrayBuffer);

    // ----- PDF -----
    if (file.type === "application/pdf") {
      const text = await extractTextFromPDF(uint8Array);

      const transactions = await extractTransactionsWithAI(text);

      return NextResponse.json(buildAnalysisResponse("pdf", transactions, period));
    }

    // ----- CSV -----
    if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
      const csvText = buffer.toString("utf-8");

      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      return NextResponse.json(
        buildAnalysisResponse("csv", normalizeTransactions(parsed.data), period)
      );
    }

    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error("Analyze error:", err);
    const details = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      {
        error: "Failed to analyze file",
        details,
      },
      { status: 500 }
    );
  }
}
