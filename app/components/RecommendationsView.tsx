"use client";

import Link from "next/link";
import Image from "next/image";

import { trackEvent } from "@/app/lib/analytics";
import type { AnalysisResult, Recommendation } from "@/app/lib/analysisTypes";

const CARD_IMAGE_ASSETS: Record<string, string> = {
  "amex-gold": "/cards/amex-gold.png",
  "amex-platinum": "/cards/amex-platinum.png",
  "atmos-ascent": "/cards/atmos-ascent.png",
  "atmos-summit": "/cards/atmos-summit.png",
  "bilt-blue": "/cards/bilt-blue.png",
  "bilt-obsidian": "/cards/bilt-obsidian.png",
  "bilt-palladium": "/cards/bilt-palladium.png",
  "blue-cash-everyday": "/cards/blue-cash-everyday.png",
  "capital-one-savor": "/cards/capital-one-savor.png",
  "chase-freedom-unlimited": "/cards/chase-freedom-unlimited.png",
  "chase-sapphire-preferred": "/cards/chase-sapphire-preferred.png",
  "delta-gold": "/cards/delta-gold.png",
  "delta-platinum": "/cards/delta-platinum.png",
  "delta-reserve": "/cards/delta-reserve.png",
  "marriott-boundless": "/cards/marriott-boundless.png",
  "sapphire-reserve": "/cards/sapphire-reserve.png",
  ventureone: "/cards/ventureone.png",
  "venture-rewards": "/cards/venture-rewards.png",
  "venture-x": "/cards/venture-x.png",
};

const CARD_VISUALS: Record<
  string,
  {
    palette: string;
    sheen: string;
    label: string;
  }
> = {
  "capital-one-savor": {
    palette: "from-rose-300 via-rose-500 to-orange-700",
    sheen: "bg-white/18",
    label: "Dining",
  },
  "blue-cash-everyday": {
    palette: "from-sky-200 via-blue-400 to-cyan-700",
    sheen: "bg-white/16",
    label: "Everyday",
  },
  "chase-freedom-unlimited": {
    palette: "from-slate-100 via-slate-300 to-slate-700",
    sheen: "bg-white/24",
    label: "Freedom",
  },
  ventureone: {
    palette: "from-violet-200 via-indigo-400 to-slate-900",
    sheen: "bg-white/12",
    label: "Miles",
  },
  "citi-custom-cash": {
    palette: "from-cyan-300 via-sky-500 to-blue-900",
    sheen: "bg-white/15",
    label: "5% back",
  },
  "bilt-blue": {
    palette: "from-cyan-100 via-sky-300 to-indigo-800",
    sheen: "bg-white/18",
    label: "Rent",
  },
  "venture-rewards": {
    palette: "from-emerald-200 via-teal-400 to-slate-900",
    sheen: "bg-white/16",
    label: "Travel",
  },
  "chase-sapphire-preferred": {
    palette: "from-indigo-100 via-indigo-400 to-slate-900",
    sheen: "bg-white/14",
    label: "Preferred",
  },
  "marriott-boundless": {
    palette: "from-stone-200 via-neutral-500 to-stone-900",
    sheen: "bg-white/16",
    label: "Hotels",
  },
  "delta-gold": {
    palette: "from-amber-200 via-yellow-400 to-orange-800",
    sheen: "bg-white/18",
    label: "SkyMiles",
  },
  "amex-gold": {
    palette: "from-amber-200 via-yellow-500 to-amber-900",
    sheen: "bg-white/18",
    label: "Gold",
  },
  "delta-platinum": {
    palette: "from-slate-100 via-slate-400 to-slate-800",
    sheen: "bg-white/18",
    label: "Platinum",
  },
  "delta-reserve": {
    palette: "from-stone-200 via-zinc-500 to-black",
    sheen: "bg-white/16",
    label: "Reserve",
  },
  "bilt-obsidian": {
    palette: "from-zinc-200 via-zinc-500 to-zinc-950",
    sheen: "bg-white/12",
    label: "Obsidian",
  },
  "atmos-ascent": {
    palette: "from-teal-100 via-cyan-400 to-slate-900",
    sheen: "bg-white/14",
    label: "Ascent",
  },
  "bilt-palladium": {
    palette: "from-slate-100 via-slate-300 to-slate-900",
    sheen: "bg-white/18",
    label: "Palladium",
  },
  "venture-x": {
    palette: "from-slate-50 via-slate-300 to-slate-950",
    sheen: "bg-white/16",
    label: "Venture X",
  },
  "amex-platinum": {
    palette: "from-slate-100 via-slate-400 to-slate-950",
    sheen: "bg-white/18",
    label: "Platinum",
  },
  "sapphire-reserve": {
    palette: "from-blue-100 via-blue-500 to-slate-950",
    sheen: "bg-white/14",
    label: "Reserve",
  },
  "atmos-summit": {
    palette: "from-indigo-100 via-cyan-400 to-slate-950",
    sheen: "bg-white/14",
    label: "Summit",
  },
};

function formatCategoryLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (char) => char.toUpperCase());
}

function formatRateLabel(multiplier: number, rewardUnit: string) {
  if (rewardUnit === "cash back dollars") {
    return `${(multiplier * 100).toFixed(2)}%`;
  }

  return `${multiplier.toFixed(2)}x`;
}

function CardArtwork({
  cardId,
  cardName,
  issuer,
}: {
  cardId: string;
  cardName: string;
  issuer: string;
}) {
  const cardImageSrc = CARD_IMAGE_ASSETS[cardId];
  const visual = CARD_VISUALS[cardId] ?? {
    palette: "from-slate-200 via-slate-500 to-slate-900",
    sheen: "bg-white/16",
    label: "Rewards",
  };

  if (cardImageSrc) {
    return (
      <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
        <Image
          src={cardImageSrc}
          alt={`${cardName} card art`}
          width={278}
          height={175}
          className="h-auto w-full max-w-[13rem] object-contain"
          priority={false}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative h-56 overflow-hidden rounded-[1.75rem] border border-white/20 bg-gradient-to-br ${visual.palette} p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]`}
    >
      <div
        className={`absolute inset-x-6 top-5 h-16 rounded-full blur-2xl ${visual.sheen}`}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.32em] text-white/70">
              {issuer}
            </p>
            <p className="mt-2 max-w-[12rem] text-xl font-semibold leading-tight">
              {cardName}
            </p>
          </div>
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-white/85">
            {visual.label}
          </span>
        </div>

        <div className="space-y-4">
          <div className="h-10 w-14 rounded-xl bg-white/75 shadow-inner" />
          <div className="flex items-end justify-between">
            <div className="font-mono text-sm tracking-[0.32em] text-white/85">
              5128  44••  ••••  9075
            </div>
            <div className="text-right text-xs uppercase tracking-[0.28em] text-white/70">
              Best match
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accent ?? "text-slate-950"}`}>
        {value}
      </p>
    </div>
  );
}

function RecommendationCard({
  card,
  rank,
}: {
  card: Recommendation;
  rank: number;
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Rank {rank}
            </span>
            <span className="text-sm text-slate-500">{card.issuer}</span>
          </div>

          <CardArtwork
            cardId={card.cardId}
            cardName={card.cardName}
            issuer={card.issuer}
          />

          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Card
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {card.cardName}
              </p>
            </div>
            <a
              href={`/api/apply-click?cardId=${encodeURIComponent(card.cardId)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("ExternalLinkClicked", { cardId: card.cardId })}
              className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)] transition hover:translate-y-[-1px]"
            >
              Go to card
            </a>
            <div>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                {card.rewardUnit}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <h3 className="text-3xl font-semibold tracking-tight text-slate-950">
              {card.cardName}
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              This card is ranked based on your spending, the rewards it offers,
              and its annual fee.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ResultMetric
              label="Expected net monthly value"
              value={`$${card.monthlyNetValue.toFixed(2)}`}
              accent={card.monthlyNetValue >= 0 ? "text-emerald-700" : "text-rose-700"}
            />
            <ResultMetric
              label="Expected net yearly value"
              value={`$${card.annualizedNetValue.toFixed(2)}`}
              accent={card.annualizedNetValue >= 0 ? "text-emerald-700" : "text-rose-700"}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ResultMetric
              label="Yearly rewards"
              value={`${card.annualizedRewardUnitsEarned.toFixed(0)}`}
            />
            <ResultMetric
              label="Gross annual value"
              value={`$${card.annualizedGrossValue.toFixed(2)}`}
            />
            <ResultMetric
              label="Annual fee"
              value={`$${card.annualFee.toFixed(2)}`}
            />
          </div>

          <div className="rounded-[1.5rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(241,245,249,0.95))] p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">
                Rewards by Category
              </h4>
              <span className="text-xs text-slate-500">
                Based on your uploaded spending
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {card.categoryBreakdown.map((item) => (
                <div
                  key={`${card.cardId}-${item.category}`}
                  className="rounded-2xl border border-white bg-white/85 p-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {formatCategoryLabel(item.category)}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                    Observed spend
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    ${item.observedSpend.toFixed(2)}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Annualized: ${item.annualizedSpend.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600">
                    Effective rate: {formatRateLabel(item.multiplier, card.rewardUnit)}
                  </p>
                  <p className="text-sm text-slate-600">
                    {item.annualizedRewardUnitsEarned.toFixed(0)} {card.rewardUnit}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    ${item.annualizedValue.toFixed(2)} annual value
                  </p>
                </div>
              ))}
            </div>
          </div>

          {card.notes && card.notes.length > 0 && (
            <p className="text-sm leading-6 text-slate-500">{card.notes[0]}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function RecommendationsView({
  result,
  showBackLink = false,
}: {
  result: AnalysisResult;
  showBackLink?: boolean;
}) {
  const topRecommendations = result.recommendations.slice(0, 3);
  const additionalRecommendations = result.recommendations.slice(3, 10);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              {result.type} analysis ·{" "}
              {result.period === "monthlyStatement"
                ? "monthly statement"
                : "annual summary"}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              ${result.observedTotalSpend.toFixed(2)} in spending analyzed
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              The cards below are ranked by how much value they could give you
              after rewards and annual fees.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultMetric
              label="Transactions"
              value={`${result.transactionCount}`}
            />
            <ResultMetric
              label="Estimated yearly spend"
              value={`$${result.annualizedTotalSpend.toFixed(2)}`}
            />
            <ResultMetric
              label="Cards shown"
              value={`${result.recommendations.length}`}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {result.categorySpend.slice(0, 8).map((item) => (
            <div
              key={item.category}
              className="rounded-[1.5rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-900">{item.label}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                Current file
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                ${item.observedAmount.toFixed(2)}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Estimated yearly spend: ${item.annualizedAmount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {showBackLink && (
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Analyze another statement
            </Link>
          </div>
        )}
      </section>

      <section className="space-y-5">
        {topRecommendations.map((card, index) => (
          <RecommendationCard key={card.cardId} card={card} rank={index + 1} />
        ))}

        {additionalRecommendations.length > 0 && (
          <details
            className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur"
            onToggle={(event) => {
              const detailsElement = event.currentTarget as HTMLDetailsElement;
              if (detailsElement.open) {
                trackEvent("ShowMoreCards");
              }
            }}
          >
            <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">
              Show more cards · ranks 4 to 10
            </summary>
            <div className="mt-6 space-y-5">
              {additionalRecommendations.map((card, index) => (
                <RecommendationCard
                  key={card.cardId}
                  card={card}
                  rank={index + 4}
                />
              ))}
            </div>
          </details>
        )}
      </section>
    </div>
  );
}
