import {
  CREDIT_CARDS,
  type CardDefinition,
  type RewardRule,
  type SpendingCategory,
} from "@/app/lib/creditCards";

export type Transaction = {
  date: string;
  description: string;
  amount: number;
};

export type CategorizedTransaction = Transaction & {
  category: SpendingCategory;
};

export type AnalysisPeriod = "monthlyStatement" | "annualSummary";

export type CardRecommendation = {
  cardId: string;
  cardName: string;
  issuer: string;
  applyUrl: string;
  annualFee: number;
  rewardUnit: string;
  centsPerUnit: number;
  annualizedRewardUnitsEarned: number;
  annualizedGrossValue: number;
  annualizedNetValue: number;
  monthlyGrossValue: number;
  monthlyNetValue: number;
  sourceUrls: string[];
  notes?: string[];
  categoryBreakdown: Array<{
    category: SpendingCategory;
    observedSpend: number;
    annualizedSpend: number;
    multiplier: number;
    annualizedRewardUnitsEarned: number;
    annualizedValue: number;
  }>;
};

export const CATEGORY_LABELS: Record<SpendingCategory, string> = {
  dining: "Dining",
  groceries: "Groceries",
  gas: "Gas",
  travel: "Travel",
  hotels: "Hotels",
  transit: "Transit",
  streaming: "Streaming",
  drugstores: "Drugstores",
  onlineShopping: "Online shopping",
  utilities: "Utilities",
  entertainment: "Entertainment",
  rentMortgage: "Rent or mortgage",
  advertising: "Advertising",
  shipping: "Shipping",
  deltaAir: "Delta purchases",
  alaskaHawaiianAir: "Alaska or Hawaiian purchases",
  marriottHotel: "Marriott stays",
  other: "Other",
};

const CATEGORY_RULES: Array<{
  category: SpendingCategory;
  patterns: RegExp[];
}> = [
  {
    category: "groceries",
    patterns: [
      /\b(whole foods|trader joe'?s|costco|aldi|safeway|kroger|publix|wegmans|h[- ]?e[- ]?b|sprouts|target grocery)\b/i,
    ],
  },
  {
    category: "dining",
    patterns: [
      /\b(restaurant|cafe|coffee|starbucks|doordash|ubereats|grubhub|chipotle|mcdonald'?s|subway|burger king|pizza|taco bell)\b/i,
    ],
  },
  {
    category: "gas",
    patterns: [/\b(shell|exxon|chevron|bp|mobil|76\b|sunoco|gas|fuel)\b/i],
  },
  {
    category: "deltaAir",
    patterns: [
      /\b(delta( air)?|skymiles)\b/i,
    ],
  },
  {
    category: "alaskaHawaiianAir",
    patterns: [/\b(alaska airlines?|hawaiian airlines?)\b/i],
  },
  {
    category: "marriottHotel",
    patterns: [
      /\b(marriott|courtyard|residence inn|springhill suites|westin|sheraton|ritz-carlton|jw marriott|aloft|st\.? regis|delta hotels)\b/i,
    ],
  },
  {
    category: "hotels",
    patterns: [
      /\b(hilton|hyatt|airbnb|expedia|booking|hotel|hotels\.com)\b/i,
    ],
  },
  {
    category: "travel",
    patterns: [
      /\b(united|american airlines|southwest|jetblue|airlines?|cruise|vacation|orbitz|kayak|travel)\b/i,
    ],
  },
  {
    category: "transit",
    patterns: [
      /\b(uber|lyft|mta|bart|metro|transit|toll|parking|amtrak|train)\b/i,
    ],
  },
  {
    category: "streaming",
    patterns: [
      /\b(netflix|spotify|hulu|disney|max|hbomax|youtube premium|apple music|peacock)\b/i,
    ],
  },
  {
    category: "drugstores",
    patterns: [/\b(cvs|walgreens|rite aid|pharmacy)\b/i],
  },
  {
    category: "onlineShopping",
    patterns: [/\b(amazon|etsy|shopify|ebay|walmart\.com|target\.com)\b/i],
  },
  {
    category: "utilities",
    patterns: [
      /\b(utility|utilities|electric|water|internet|comcast|xfinity|verizon|at&t|tmobile|t-mobile)\b/i,
    ],
  },
  {
    category: "rentMortgage",
    patterns: [/\b(rent|mortgage|landlord|property management|apartment)\b/i],
  },
  {
    category: "advertising",
    patterns: [/\b(google ads|meta ads|facebook ads|instagram ads|tiktok ads)\b/i],
  },
  {
    category: "shipping",
    patterns: [/\b(fedex|ups|usps|dhl|stamps\.com)\b/i],
  },
  {
    category: "entertainment",
    patterns: [
      /\b(movie|cinema|theater|ticketmaster|concert|eventbrite|disneyland|universal)\b/i,
    ],
  },
];

export function normalizeTransactions(value: unknown): Transaction[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((row) => {
      if (typeof row !== "object" || row === null) return null;
      const obj = row as Record<string, unknown>;
      const date = typeof obj.date === "string" ? obj.date.trim() : "";
      const description =
        typeof obj.description === "string" ? obj.description.trim() : "";
      const amount =
        typeof obj.amount === "number"
          ? obj.amount
          : Number(String(obj.amount ?? "").replace(/[^0-9.-]/g, ""));

      if (!date || !description || !Number.isFinite(amount)) return null;
      return { date, description, amount };
    })
    .filter((x): x is Transaction => x !== null);
}

export function categorizeTransaction(description: string): SpendingCategory {
  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(description))) {
      return rule.category;
    }
  }

  return "other";
}

export function categorizeTransactions(
  transactions: Transaction[]
): CategorizedTransaction[] {
  return transactions.map((transaction) => ({
    ...transaction,
    category: categorizeTransaction(transaction.description),
  }));
}

export function sumCategorySpending(transactions: CategorizedTransaction[]) {
  const totals = Object.fromEntries(
    Object.keys(CATEGORY_LABELS).map((category) => [category, 0])
  ) as Record<SpendingCategory, number>;

  for (const transaction of transactions) {
    if (transaction.amount >= 0) continue;
    totals[transaction.category] += Math.abs(transaction.amount);
  }

  return totals;
}

export function buildRecommendations(
  categorySpend: Record<SpendingCategory, number>,
  observationMonths = 12
) {
  const annualizationFactor = 12 / observationMonths;
  const recommendations: CardRecommendation[] = CREDIT_CARDS.filter(
    (card) => card.audience === "personal"
  ).map((card) => {
    const categoryBreakdown = buildCategoryBreakdown(
      card,
      categorySpend,
      annualizationFactor
    );

    const annualizedRewardUnitsEarned = Number(
      categoryBreakdown
        .reduce((sum, item) => sum + item.annualizedRewardUnitsEarned, 0)
        .toFixed(2)
    );
    const annualizedGrossValue = Number(
      categoryBreakdown
        .reduce((sum, item) => sum + item.annualizedValue, 0)
        .toFixed(2)
    );
    const annualizedNetValue = Number(
      (annualizedGrossValue - card.annualFee).toFixed(2)
    );
    const monthlyGrossValue = Number((annualizedGrossValue / 12).toFixed(2));
    const monthlyNetValue = Number((annualizedNetValue / 12).toFixed(2));

    return {
      cardId: card.id,
      cardName: card.name,
      issuer: card.issuer,
      applyUrl: card.applyUrl,
      annualFee: card.annualFee,
      rewardUnit: card.rewardUnit,
      centsPerUnit: card.centsPerUnit,
      sourceUrls: card.sourceUrls,
      notes: card.notes,
      annualizedRewardUnitsEarned,
      annualizedGrossValue,
      annualizedNetValue,
      monthlyGrossValue,
      monthlyNetValue,
      categoryBreakdown,
    };
  });

  return recommendations
    .sort((a, b) => b.monthlyNetValue - a.monthlyNetValue)
    .slice(0, 10);
}

function buildCategoryBreakdown(
  card: CardDefinition,
  categorySpend: Record<SpendingCategory, number>,
  annualizationFactor: number
) {
  const breakdown = (Object.keys(CATEGORY_LABELS) as SpendingCategory[]).map(
    (category) => {
      const observedSpend = Number((categorySpend[category] ?? 0).toFixed(2));
      const annualizedSpend = Number(
        (observedSpend * annualizationFactor).toFixed(2)
      );
      const { rewardUnitsEarned, value } = calculateCategoryRewards(
        card,
        category,
        annualizedSpend,
        scaleCategorySpend(categorySpend, annualizationFactor)
      );

      return {
        category,
        observedSpend,
        annualizedSpend,
        multiplier:
          annualizedSpend > 0
            ? Number((rewardUnitsEarned / annualizedSpend).toFixed(4))
            : 0,
        annualizedRewardUnitsEarned: rewardUnitsEarned,
        annualizedValue: value,
      };
    }
  );

  return breakdown.filter((entry) => entry.observedSpend > 0);
}

function scaleCategorySpend(
  categorySpend: Record<SpendingCategory, number>,
  annualizationFactor: number
) {
  return Object.fromEntries(
    (Object.keys(CATEGORY_LABELS) as SpendingCategory[]).map((category) => [
      category,
      Number((((categorySpend[category] ?? 0) * annualizationFactor)).toFixed(2)),
    ])
  ) as Record<SpendingCategory, number>;
}

function calculateCategoryRewards(
  card: CardDefinition,
  category: SpendingCategory,
  spend: number,
  categorySpend: Record<SpendingCategory, number>
) {
  if (spend <= 0) {
    return { rewardUnitsEarned: 0, value: 0 };
  }

  const specialRule = card.rules.find(
    (rule) =>
      typeof rule.topEligibleCategoryCount === "number" &&
      rule.topEligibleCategoryCount > 0 &&
      rule.categories.includes(category)
  );

  if (specialRule) {
    return calculateTopCategoryRule(card, specialRule, category, spend, categorySpend);
  }

  const standardRule = getBestStandardRule(card.rules, category);
  const baseReward = calculateRewardsForRate(card, spend, card.defaultRate);

  if (!standardRule) {
    return baseReward;
  }

  if (!standardRule.spendCap) {
    return calculateRewardsForRate(card, spend, standardRule.rate);
  }

  const bonusSpend = Math.min(spend, standardRule.spendCap);
  const baseSpend = Math.max(0, spend - bonusSpend);
  const bonusReward = calculateRewardsForRate(card, bonusSpend, standardRule.rate);
  const remainderReward = calculateRewardsForRate(
    card,
    baseSpend,
    card.defaultRate
  );

  return {
    rewardUnitsEarned: Number(
      (bonusReward.rewardUnitsEarned + remainderReward.rewardUnitsEarned).toFixed(2)
    ),
    value: Number((bonusReward.value + remainderReward.value).toFixed(2)),
  };
}

function getBestStandardRule(
  rules: RewardRule[],
  category: SpendingCategory
): RewardRule | undefined {
  return rules
    .filter(
      (rule) =>
        (!rule.topEligibleCategoryCount || rule.topEligibleCategoryCount < 1) &&
        rule.categories.includes(category)
    )
    .sort((a, b) => b.rate - a.rate)[0];
}

function calculateTopCategoryRule(
  card: CardDefinition,
  rule: RewardRule,
  category: SpendingCategory,
  spend: number,
  categorySpend: Record<SpendingCategory, number>
) {
  const topCategories = [...rule.categories]
    .sort((a, b) => categorySpend[b] - categorySpend[a])
    .slice(0, rule.topEligibleCategoryCount ?? 1);

  if (!topCategories.includes(category)) {
    return calculateRewardsForRate(card, spend, card.defaultRate);
  }

  const sharedCap = rule.spendCap ?? spend;
  const spendBeforeCategory = topCategories
    .slice(0, topCategories.indexOf(category))
    .reduce((sum, item) => sum + categorySpend[item], 0);
  const remainingCap = Math.max(0, sharedCap - spendBeforeCategory);
  const cappedSpend = Math.min(spend, remainingCap);
  const uncappedSpend = Math.max(0, spend - cappedSpend);
  const bonusReward = calculateRewardsForRate(card, cappedSpend, rule.rate);
  const remainderReward = calculateRewardsForRate(
    card,
    uncappedSpend,
    card.defaultRate
  );

  return {
    rewardUnitsEarned: Number(
      (bonusReward.rewardUnitsEarned + remainderReward.rewardUnitsEarned).toFixed(2)
    ),
    value: Number((bonusReward.value + remainderReward.value).toFixed(2)),
  };
}

function calculateRewardsForRate(
  card: CardDefinition,
  spend: number,
  rate: number
) {
  if (card.rewardType === "cashBack") {
    const rewardUnitsEarned = Number(((spend * rate) / 100).toFixed(2));

    return {
      rewardUnitsEarned,
      value: rewardUnitsEarned,
    };
  }

  const rewardUnitsEarned = Number((spend * rate).toFixed(2));

  return {
    rewardUnitsEarned,
    value: Number(((rewardUnitsEarned * card.centsPerUnit) / 100).toFixed(2)),
  };
}

export function buildAnalysisResponse(
  fileType: "pdf" | "csv",
  transactions: Transaction[],
  period: AnalysisPeriod = "annualSummary"
) {
  const normalizedTransactions = normalizeTransactions(transactions);
  const categorizedTransactions = categorizeTransactions(normalizedTransactions);
  const categorySpend = sumCategorySpending(categorizedTransactions);
  const observationMonths = period === "monthlyStatement" ? 1 : 12;
  const annualizationFactor = 12 / observationMonths;
  const totalSpend = Number(
    categorizedTransactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)
      .toFixed(2)
  );
  const annualizedTotalSpend = Number((totalSpend * annualizationFactor).toFixed(2));

  return {
    type: fileType,
    period,
    observationMonths,
    annualizationFactor,
    transactionCount: categorizedTransactions.length,
    observedTotalSpend: totalSpend,
    annualizedTotalSpend,
    categorySpend: (Object.keys(CATEGORY_LABELS) as SpendingCategory[])
      .map((category) => ({
        category,
        label: CATEGORY_LABELS[category],
        observedAmount: Number(categorySpend[category].toFixed(2)),
        annualizedAmount: Number(
          (categorySpend[category] * annualizationFactor).toFixed(2)
        ),
      }))
      .filter((entry) => entry.observedAmount > 0)
      .sort((a, b) => b.annualizedAmount - a.annualizedAmount),
    recommendations: buildRecommendations(categorySpend, observationMonths),
    transactions: categorizedTransactions,
  };
}
