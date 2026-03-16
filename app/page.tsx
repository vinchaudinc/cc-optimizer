import FileUpload from "./components/FileUpload";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/50 bg-[linear-gradient(135deg,#102a43_0%,#13315c_35%,#b25c36_100%)] px-6 py-10 text-white shadow-[0_30px_120px_rgba(16,42,67,0.35)] sm:px-8 lg:px-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/85 backdrop-blur">
                Find your best-fit card
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  Find the credit card that gives you the most rewards.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                  Upload a monthly statement or annual summary and see which
                  cards would have earned you the most value based on how you
                  actually spend.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                    Based on your spending
                  </p>
                  <p className="mt-2 text-lg font-semibold">We group your spending by category</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                    Easy to compare
                  </p>
                  <p className="mt-2 text-lg font-semibold">Annual fees are already included</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                    Clear results
                  </p>
                  <p className="mt-2 text-lg font-semibold">See the top 3 first, then the rest</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[18rem]">
              <div className="absolute left-0 top-10 h-52 w-80 rotate-[-8deg] rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,#f6b44b_0%,#ed8f03_35%,#5b2500_100%)] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
                <div className="flex h-full flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-14 rounded-xl bg-white/80" />
                    <span className="text-xs uppercase tracking-[0.3em] text-white/80">
                      Gold
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Best for dining</p>
                    <p className="mt-2 text-3xl font-semibold">4x dining</p>
                  </div>
                  <p className="text-sm text-white/80">American Express Gold</p>
                </div>
              </div>
              <div className="absolute right-0 top-0 h-56 w-[21rem] rotate-[10deg] rounded-[2rem] border border-white/20 bg-[linear-gradient(145deg,#d5dde8_0%,#65758a_35%,#1f2937_100%)] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
                <div className="flex h-full flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-14 rounded-xl bg-white/75" />
                    <span className="text-xs uppercase tracking-[0.3em] text-white/80">
                      Reserve
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Best for travel</p>
                    <p className="mt-2 text-3xl font-semibold">More value back</p>
                  </div>
                  <p className="text-sm text-white/80">Chase Sapphire Reserve</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FileUpload />

        <section className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="font-semibold text-slate-900">Private by default</p>
            <p className="mt-2">No bank login needed. Just upload your statement.</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="font-semibold text-slate-900">Based on real card rules</p>
            <p className="mt-2">We compare rewards and annual fees for you.</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="font-semibold text-slate-900">Simple to scan</p>
            <p className="mt-2">See the best options first, then expand for more.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
