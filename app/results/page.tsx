"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import RecommendationsView from "@/app/components/RecommendationsView";
import type { AnalysisResult } from "@/app/lib/analysisTypes";

const ANALYSIS_RESULT_STORAGE_KEY = "cc-optimizer-analysis-result";

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(ANALYSIS_RESULT_STORAGE_KEY);

    if (!stored) {
      setIsReady(true);
      return;
    }

    try {
      setResult(JSON.parse(stored) as AnalysisResult);
    } catch {
      sessionStorage.removeItem(ANALYSIS_RESULT_STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {!isReady ? (
          <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Loading your results
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              We are opening your saved recommendations now.
            </p>
          </section>
        ) : result ? (
          <RecommendationsView result={result} showBackLink />
        ) : (
          <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              No results yet
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Upload a statement first, then we will show your best card matches
              here.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
              >
                Go back to upload
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
