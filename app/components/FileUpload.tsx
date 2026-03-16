"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ANALYSIS_RESULT_STORAGE_KEY = "cc-optimizer-analysis-result";

export default function FileUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<"monthlyStatement" | "annualSummary">(
    "monthlyStatement"
  );

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("period", period);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to analyze file");
        return;
      }

      sessionStorage.setItem(ANALYSIS_RESULT_STORAGE_KEY, JSON.stringify(data));
      router.push("/results");
    } catch {
      setError("Failed to analyze file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/72 p-6 shadow-[0_28px_120px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-600">
                Upload your statement
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                See which personal credit card gives you the most rewards.
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Pick your statement type, upload your file, and we will compare
                your spending across the best personal credit cards.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`cursor-pointer rounded-[1.5rem] border p-5 transition ${
                  period === "monthlyStatement"
                    ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="period"
                  value="monthlyStatement"
                  checked={period === "monthlyStatement"}
                  onChange={() => setPeriod("monthlyStatement")}
                  className="sr-only"
                />
                <p className="text-xs uppercase tracking-[0.24em] opacity-70">
                  Upload type
                </p>
                <p className="mt-2 text-xl font-semibold">Monthly statement</p>
              </label>

              <label
                className={`cursor-pointer rounded-[1.5rem] border p-5 transition ${
                  period === "annualSummary"
                    ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="period"
                  value="annualSummary"
                  checked={period === "annualSummary"}
                  onChange={() => setPeriod("annualSummary")}
                  className="sr-only"
                />
                <p className="text-xs uppercase tracking-[0.24em] opacity-70">
                  Upload type
                </p>
                <p className="mt-2 text-xl font-semibold">Annual summary</p>
              </label>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)] p-5 shadow-inner sm:p-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  File types
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  PDF statements and CSV exports
                </p>
              </div>

              <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 px-6 py-8 text-center transition hover:border-slate-500">
                <input
                  type="file"
                  accept=".csv,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="sr-only"
                />
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                  Browse and upload file
                </p>
                <p className="mt-3 text-xl font-semibold text-slate-950">
                  {file ? file.name : "Choose your statement file"}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  No bank login needed.
                </p>
              </label>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(29,78,216,0.24)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Checking your spending..." : "Find my best card"}
              </button>

              {error && (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
