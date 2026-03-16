export type CategorySpend = {
  category: string;
  label: string;
  observedAmount: number;
  annualizedAmount: number;
};

export type Recommendation = {
  cardId: string;
  cardName: string;
  issuer: string;
  annualFee: number;
  rewardUnit: string;
  annualizedRewardUnitsEarned: number;
  annualizedGrossValue: number;
  annualizedNetValue: number;
  monthlyGrossValue: number;
  monthlyNetValue: number;
  notes?: string[];
  categoryBreakdown: Array<{
    category: string;
    observedSpend: number;
    annualizedSpend: number;
    multiplier: number;
    annualizedRewardUnitsEarned: number;
    annualizedValue: number;
  }>;
};

export type AnalysisResult = {
  type: string;
  period: "monthlyStatement" | "annualSummary";
  observationMonths: number;
  annualizationFactor: number;
  transactionCount: number;
  observedTotalSpend: number;
  annualizedTotalSpend: number;
  categorySpend: CategorySpend[];
  recommendations: Recommendation[];
  transactions: Array<{
    date: string;
    description: string;
    amount: number;
    category: string;
  }>;
};
