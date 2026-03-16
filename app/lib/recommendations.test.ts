import { describe, expect, it } from "vitest";

import {
  buildAnalysisResponse,
  buildRecommendations,
  categorizeTransaction,
  categorizeTransactions,
  normalizeTransactions,
  sumCategorySpending,
  type Transaction,
} from "./recommendations";

describe("normalizeTransactions", () => {
  it("keeps valid rows and coerces string amounts", () => {
    const result = normalizeTransactions([
      {
        date: "2026-03-01",
        description: "Whole Foods",
        amount: "-45.67",
      },
      {
        date: "2026-03-02",
        description: "Payroll",
        amount: "$1000.00",
      },
      {
        date: "",
        description: "Bad row",
        amount: 10,
      },
    ]);

    expect(result).toEqual([
      {
        date: "2026-03-01",
        description: "Whole Foods",
        amount: -45.67,
      },
      {
        date: "2026-03-02",
        description: "Payroll",
        amount: 1000,
      },
    ]);
  });
});

describe("categorization", () => {
  it("matches merchant descriptions to expected categories", () => {
    expect(categorizeTransaction("UBER TRIP SAN FRANCISCO")).toBe("transit");
    expect(categorizeTransaction("NETFLIX.COM")).toBe("streaming");
    expect(categorizeTransaction("WHOLE FOODS MARKET")).toBe("groceries");
    expect(categorizeTransaction("UNKNOWN LOCAL SHOP")).toBe("other");
  });

  it("categorizes a transaction list", () => {
    const transactions: Transaction[] = [
      { date: "2026-03-01", description: "Starbucks", amount: -8.5 },
      { date: "2026-03-02", description: "Shell Oil", amount: -50 },
    ];

    expect(categorizeTransactions(transactions)).toEqual([
      {
        date: "2026-03-01",
        description: "Starbucks",
        amount: -8.5,
        category: "dining",
      },
      {
        date: "2026-03-02",
        description: "Shell Oil",
        amount: -50,
        category: "gas",
      },
    ]);
  });
});

describe("spend aggregation", () => {
  it("counts only spending transactions toward category totals", () => {
    const totals = sumCategorySpending([
      {
        date: "2026-03-01",
        description: "Starbucks",
        amount: -12.5,
        category: "dining",
      },
      {
        date: "2026-03-02",
        description: "Whole Foods",
        amount: -80,
        category: "groceries",
      },
      {
        date: "2026-03-03",
        description: "Refund",
        amount: 20,
        category: "dining",
      },
    ]);

    expect(totals.dining).toBe(12.5);
    expect(totals.groceries).toBe(80);
    expect(totals.other).toBe(0);
  });
});

describe("recommendations", () => {
  it("ranks cards by net value for dining and grocery heavy spend", () => {
    const recommendations = buildRecommendations({
      dining: 2500,
      groceries: 4000,
      gas: 200,
      travel: 300,
      transit: 150,
      streaming: 240,
      drugstores: 0,
      onlineShopping: 100,
      utilities: 0,
      entertainment: 100,
      other: 500,
    });

    expect(recommendations).toHaveLength(10);
    expect(recommendations.slice(0, 3).map((card) => card.cardId)).toEqual([
      "capital-one-savor",
      "blue-cash-everyday",
      "chase-freedom-unlimited",
    ]);
    expect(
      recommendations.every((card) => !card.cardId.includes("business"))
    ).toBe(true);
    expect(recommendations[0]?.monthlyNetValue).toBeGreaterThan(
      recommendations[1]?.monthlyNetValue ?? 0
    );
  });

  it("calculates exact reward values for the top recommendation", () => {
    const [topCard] = buildRecommendations({
      dining: 2500,
      groceries: 4000,
      gas: 200,
      travel: 300,
      transit: 150,
      streaming: 240,
      drugstores: 0,
      onlineShopping: 100,
      utilities: 0,
      entertainment: 100,
      other: 500,
    });

    expect(topCard?.cardId).toBe("capital-one-savor");
    expect(topCard?.annualizedRewardUnitsEarned).toBe(217.7);
    expect(topCard?.annualizedGrossValue).toBe(217.7);
    expect(topCard?.annualizedNetValue).toBe(217.7);
    expect(topCard?.categoryBreakdown).toContainEqual({
      category: "dining",
      observedSpend: 2500,
      annualizedSpend: 2500,
      multiplier: 0.03,
      annualizedRewardUnitsEarned: 75,
      annualizedValue: 75,
    });
    expect(topCard?.categoryBreakdown).toContainEqual({
      category: "groceries",
      observedSpend: 4000,
      annualizedSpend: 4000,
      multiplier: 0.03,
      annualizedRewardUnitsEarned: 120,
      annualizedValue: 120,
    });
  });

  it("subtracts annual fees correctly when computing net value", () => {
    const recommendations = buildRecommendations({
      dining: 1000,
      groceries: 1000,
      gas: 0,
      travel: 0,
      transit: 0,
      streaming: 0,
      drugstores: 0,
      onlineShopping: 0,
      utilities: 0,
      entertainment: 0,
      other: 0,
    });

    const amexGold = recommendations.find((card) => card.cardId === "amex-gold");
    const blueCashEveryday = recommendations.find(
      (card) => card.cardId === "blue-cash-everyday"
    );

    expect(amexGold).toBeUndefined();
    expect(blueCashEveryday?.annualizedGrossValue).toBe(40);
    expect(blueCashEveryday?.annualizedNetValue).toBe(40);
    expect(blueCashEveryday?.monthlyNetValue).toBe(3.33);
  });

  it("applies Citi Custom Cash only to the highest eligible category up to $500", () => {
    const recommendations = buildRecommendations({
      dining: 250,
      groceries: 900,
      gas: 100,
      travel: 0,
      transit: 0,
      streaming: 0,
      drugstores: 0,
      onlineShopping: 0,
      utilities: 0,
      entertainment: 0,
      other: 0,
    });

    const citiCustomCash = recommendations.find(
      (card) => card.cardId === "citi-custom-cash"
    );

    expect(citiCustomCash?.categoryBreakdown).toContainEqual({
      category: "groceries",
      observedSpend: 900,
      annualizedSpend: 900,
      multiplier: 0.0322,
      annualizedRewardUnitsEarned: 29,
      annualizedValue: 29,
    });
    expect(citiCustomCash?.categoryBreakdown).toContainEqual({
      category: "dining",
      observedSpend: 250,
      annualizedSpend: 250,
      multiplier: 0.01,
      annualizedRewardUnitsEarned: 2.5,
      annualizedValue: 2.5,
    });
  });
});

describe("buildAnalysisResponse", () => {
  it("returns categorized spend and top recommendations for an annual summary", () => {
    const response = buildAnalysisResponse("csv", [
      {
        date: "2026-03-01",
        description: "Whole Foods Market",
        amount: -120,
      },
      {
        date: "2026-03-02",
        description: "Uber Trip",
        amount: -35,
      },
      {
        date: "2026-03-03",
        description: "Payroll Deposit",
        amount: 2000,
      },
    ]);

    expect(response.type).toBe("csv");
    expect(response.period).toBe("annualSummary");
    expect(response.observedTotalSpend).toBe(155);
    expect(response.annualizedTotalSpend).toBe(155);
    expect(response.transactionCount).toBe(3);
    expect(response.categorySpend).toEqual([
      {
        category: "groceries",
        label: "Groceries",
        observedAmount: 120,
        annualizedAmount: 120,
      },
      {
        category: "transit",
        label: "Transit",
        observedAmount: 35,
        annualizedAmount: 35,
      },
    ]);
    expect(response.transactions[0]?.category).toBe("groceries");
    expect(response.recommendations).toHaveLength(10);
  });

  it("annualizes spend and rewards for a monthly statement upload", () => {
    const response = buildAnalysisResponse(
      "csv",
      [
        {
          date: "2026-03-01",
          description: "Whole Foods Market",
          amount: -120,
        },
        {
          date: "2026-03-02",
          description: "Uber Trip",
          amount: -35,
        },
      ],
      "monthlyStatement"
    );

    expect(response.period).toBe("monthlyStatement");
    expect(response.observationMonths).toBe(1);
    expect(response.annualizationFactor).toBe(12);
    expect(response.observedTotalSpend).toBe(155);
    expect(response.annualizedTotalSpend).toBe(1860);
    expect(response.categorySpend).toEqual([
      {
        category: "groceries",
        label: "Groceries",
        observedAmount: 120,
        annualizedAmount: 1440,
      },
      {
        category: "transit",
        label: "Transit",
        observedAmount: 35,
        annualizedAmount: 420,
      },
    ]);
    expect(response.recommendations).toHaveLength(10);
    expect(response.recommendations[0]?.monthlyNetValue).toBeGreaterThan(0);
  });
});
