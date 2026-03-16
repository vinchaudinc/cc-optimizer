export type SpendingCategory =
  | "dining"
  | "groceries"
  | "gas"
  | "travel"
  | "hotels"
  | "transit"
  | "streaming"
  | "drugstores"
  | "onlineShopping"
  | "utilities"
  | "entertainment"
  | "rentMortgage"
  | "advertising"
  | "shipping"
  | "deltaAir"
  | "alaskaHawaiianAir"
  | "marriottHotel"
  | "other";

export type RewardRule = {
  categories: SpendingCategory[];
  rate: number;
  spendCap?: number;
  capPeriod?: "billingCycle" | "year";
  topEligibleCategoryCount?: number;
};

export type CardDefinition = {
  id: string;
  name: string;
  issuer: string;
  audience: "personal" | "business";
  applyUrl: string;
  annualFee: number;
  rewardType: "points" | "cashBack";
  rewardUnit: string;
  centsPerUnit: number;
  defaultRate: number;
  rules: RewardRule[];
  sourceUrls: string[];
  notes?: string[];
};

const TPG_BEST_CARDS_URL = "https://thepointsguy.com/credit-cards/best/";

export const CREDIT_CARDS: CardDefinition[] = [
  {
    id: "capital-one-savor",
    name: "Capital One Savor Rewards",
    issuer: "Capital One",
    audience: "personal",
    applyUrl: "https://www.capitalone.com/credit-cards/savor/",
    annualFee: 0,
    rewardType: "cashBack",
    rewardUnit: "cash back dollars",
    centsPerUnit: 100,
    defaultRate: 1,
    rules: [
      {
        categories: ["dining", "groceries", "streaming", "entertainment"],
        rate: 3,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL, "https://www.capitalone.com/credit-cards/savor/"],
  },
  {
    id: "blue-cash-everyday",
    name: "Blue Cash Everyday Card",
    issuer: "American Express",
    audience: "personal",
    applyUrl: "https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/",
    annualFee: 0,
    rewardType: "cashBack",
    rewardUnit: "cash back dollars",
    centsPerUnit: 100,
    defaultRate: 1,
    rules: [
      {
        categories: ["groceries", "gas", "onlineShopping"],
        rate: 3,
        spendCap: 6000,
        capPeriod: "year",
      },
    ],
    sourceUrls: [
      TPG_BEST_CARDS_URL,
      "https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/",
    ],
  },
  {
    id: "chase-freedom-unlimited",
    name: "Chase Freedom Unlimited",
    issuer: "Chase",
    audience: "personal",
    applyUrl: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    annualFee: 0,
    rewardType: "cashBack",
    rewardUnit: "cash back dollars",
    centsPerUnit: 100,
    defaultRate: 1.5,
    rules: [
      {
        categories: ["dining", "drugstores"],
        rate: 3,
      },
    ],
    sourceUrls: [
      TPG_BEST_CARDS_URL,
      "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    ],
    notes: [
      "Chase Travel portal bonuses are not modeled because uploaded statements do not reliably identify portal bookings.",
    ],
  },
  {
    id: "ventureone",
    name: "Capital One VentureOne Rewards",
    issuer: "Capital One",
    audience: "personal",
    applyUrl: "https://www.capitalone.com/credit-cards/ventureone/",
    annualFee: 0,
    rewardType: "points",
    rewardUnit: "Capital One miles",
    centsPerUnit: 1,
    defaultRate: 1.25,
    rules: [],
    sourceUrls: [TPG_BEST_CARDS_URL, "https://www.capitalone.com/credit-cards/ventureone/"],
    notes: [
      "Capital One Travel portal bonuses are not modeled because uploaded statements do not reliably identify portal bookings.",
    ],
  },
  {
    id: "citi-custom-cash",
    name: "Citi Custom Cash Card",
    issuer: "Citi",
    audience: "personal",
    applyUrl: "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
    annualFee: 0,
    rewardType: "cashBack",
    rewardUnit: "cash back dollars",
    centsPerUnit: 100,
    defaultRate: 1,
    rules: [
      {
        categories: [
          "dining",
          "groceries",
          "gas",
          "travel",
          "transit",
          "streaming",
          "drugstores",
          "entertainment",
        ],
        rate: 5,
        spendCap: 500,
        capPeriod: "billingCycle",
        topEligibleCategoryCount: 1,
      },
    ],
    sourceUrls: [
      TPG_BEST_CARDS_URL,
      "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
    ],
  },
  {
    id: "bilt-blue",
    name: "Bilt Blue Card",
    issuer: "Bilt",
    audience: "personal",
    applyUrl: "https://www.bilt.com/",
    annualFee: 0,
    rewardType: "points",
    rewardUnit: "Bilt points",
    centsPerUnit: 1.5,
    defaultRate: 1,
    rules: [
      {
        categories: ["rentMortgage"],
        rate: 1,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
    notes: ["Mortgage and rent benefits are approximated from merchant descriptions and may miss indirect payment processors."],
  },
  {
    id: "venture-rewards",
    name: "Capital One Venture Rewards",
    issuer: "Capital One",
    audience: "personal",
    applyUrl: "https://www.capitalone.com/credit-cards/venture/",
    annualFee: 95,
    rewardType: "points",
    rewardUnit: "Capital One miles",
    centsPerUnit: 1,
    defaultRate: 2,
    rules: [],
    sourceUrls: [TPG_BEST_CARDS_URL, "https://www.capitalone.com/credit-cards/venture/"],
    notes: [
      "Capital One Travel portal bonuses are not modeled because uploaded statements do not reliably identify portal bookings.",
    ],
  },
  {
    id: "chase-sapphire-preferred",
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    audience: "personal",
    applyUrl: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    annualFee: 95,
    rewardType: "points",
    rewardUnit: "Ultimate Rewards points",
    centsPerUnit: 1.25,
    defaultRate: 1,
    rules: [
      {
        categories: ["dining", "streaming", "onlineShopping"],
        rate: 3,
      },
      {
        categories: ["travel", "hotels", "transit"],
        rate: 2,
      },
    ],
    sourceUrls: [
      TPG_BEST_CARDS_URL,
      "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    ],
    notes: [
      "Chase Travel portal bonuses are not modeled because uploaded statements do not reliably identify portal bookings.",
    ],
  },
  {
    id: "marriott-boundless",
    name: "Marriott Bonvoy Boundless Credit Card",
    issuer: "Chase",
    audience: "personal",
    applyUrl:
      "https://www.marriott.com/credit-cards/chase-credit-cards.mi~X~EE8E9B30-BDEE-56C5-8819-E5BD4AE8828A",
    annualFee: 95,
    rewardType: "points",
    rewardUnit: "Marriott Bonvoy points",
    centsPerUnit: 0.7,
    defaultRate: 2,
    rules: [
      {
        categories: ["marriottHotel"],
        rate: 6,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
    notes: ["Marriott-specific earning only applies when the statement merchant can be identified as a Marriott brand."],
  },
  {
    id: "delta-gold",
    name: "Delta SkyMiles Gold American Express Card",
    issuer: "American Express",
    audience: "personal",
    applyUrl:
      "https://content.delta.com/content/www/us/en/skymiles/airline-credit-cards/american-express-personal-cards.html",
    annualFee: 150,
    rewardType: "points",
    rewardUnit: "Delta SkyMiles",
    centsPerUnit: 1.1,
    defaultRate: 1,
    rules: [
      {
        categories: ["deltaAir", "dining", "groceries"],
        rate: 2,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
  },
  {
    id: "spark-cash-plus",
    name: "Capital One Spark Cash Plus",
    issuer: "Capital One",
    audience: "business",
    applyUrl: "https://www.capitalone.com/small-business/credit-cards/spark-cash-plus/",
    annualFee: 150,
    rewardType: "cashBack",
    rewardUnit: "cash back dollars",
    centsPerUnit: 100,
    defaultRate: 2,
    rules: [],
    sourceUrls: [TPG_BEST_CARDS_URL],
  },
  {
    id: "spark-miles-business",
    name: "Capital One Spark Miles for Business",
    issuer: "Capital One",
    audience: "business",
    applyUrl: "https://www.capitalone.com/small-business/credit-cards/travel-and-miles/",
    annualFee: 0,
    rewardType: "points",
    rewardUnit: "Capital One miles",
    centsPerUnit: 1,
    defaultRate: 2,
    rules: [],
    sourceUrls: [TPG_BEST_CARDS_URL],
  },
  {
    id: "amex-gold",
    name: "American Express Gold Card",
    issuer: "American Express",
    audience: "personal",
    applyUrl: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
    annualFee: 325,
    rewardType: "points",
    rewardUnit: "Membership Rewards points",
    centsPerUnit: 1.5,
    defaultRate: 1,
    rules: [
      {
        categories: ["dining"],
        rate: 4,
        spendCap: 50000,
        capPeriod: "year",
      },
      {
        categories: ["groceries"],
        rate: 4,
        spendCap: 25000,
        capPeriod: "year",
      },
      {
        categories: ["deltaAir", "alaskaHawaiianAir", "travel"],
        rate: 3,
      },
    ],
    sourceUrls: [
      TPG_BEST_CARDS_URL,
      "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
    ],
    notes: ["Flight-related travel earning is approximated from merchant descriptions and may not perfectly match issuer eligibility rules."],
  },
  {
    id: "amex-business-gold",
    name: "American Express Business Gold Card",
    issuer: "American Express",
    audience: "business",
    applyUrl:
      "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card-amex/",
    annualFee: 375,
    rewardType: "points",
    rewardUnit: "Membership Rewards points",
    centsPerUnit: 1.5,
    defaultRate: 1,
    rules: [
      {
        categories: ["dining", "gas", "transit", "utilities", "advertising"],
        rate: 4,
        spendCap: 150000,
        capPeriod: "year",
        topEligibleCategoryCount: 2,
      },
      {
        categories: ["travel", "hotels"],
        rate: 3,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
    notes: ["The top-two-category rule is approximated using the highest matching spend categories detected in the uploaded statement."],
  },
  {
    id: "delta-platinum",
    name: "Delta SkyMiles Platinum American Express Card",
    issuer: "American Express",
    audience: "personal",
    applyUrl:
      "https://content.delta.com/content/www/us/en/skymiles/airline-credit-cards/american-express-personal-cards.html",
    annualFee: 350,
    rewardType: "points",
    rewardUnit: "Delta SkyMiles",
    centsPerUnit: 1.1,
    defaultRate: 1,
    rules: [
      {
        categories: ["deltaAir", "hotels"],
        rate: 3,
      },
      {
        categories: ["dining", "groceries"],
        rate: 2,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
    notes: ["Hotel earning is approximated from merchant descriptions and may not perfectly match issuer eligibility rules."],
  },
  {
    id: "delta-reserve",
    name: "Delta SkyMiles Reserve American Express Card",
    issuer: "American Express",
    audience: "personal",
    applyUrl:
      "https://content.delta.com/content/www/us/en/skymiles/airline-credit-cards/american-express-personal-cards.html",
    annualFee: 650,
    rewardType: "points",
    rewardUnit: "Delta SkyMiles",
    centsPerUnit: 1.1,
    defaultRate: 1,
    rules: [
      {
        categories: ["deltaAir"],
        rate: 3,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
  },
  {
    id: "bilt-obsidian",
    name: "Bilt Obsidian Card",
    issuer: "Bilt",
    audience: "personal",
    applyUrl: "https://www.bilt.com/",
    annualFee: 95,
    rewardType: "points",
    rewardUnit: "Bilt points",
    centsPerUnit: 1.5,
    defaultRate: 1,
    rules: [
      {
        categories: ["dining", "groceries"],
        rate: 3,
        spendCap: 25000,
        capPeriod: "year",
        topEligibleCategoryCount: 1,
      },
      {
        categories: ["travel", "hotels"],
        rate: 2,
      },
      {
        categories: ["rentMortgage"],
        rate: 1.25,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
    notes: ["The dining-or-groceries choice is approximated using whichever of those categories has higher detected spend."],
  },
  {
    id: "atmos-ascent",
    name: "Atmos Rewards Ascent Visa Signature credit card",
    issuer: "Bank of America",
    audience: "personal",
    applyUrl: "https://thepointsguy.com/credit-cards/best/",
    annualFee: 495,
    rewardType: "points",
    rewardUnit: "Atmos points",
    centsPerUnit: 1,
    defaultRate: 1,
    rules: [
      {
        categories: ["dining", "transit", "gas", "alaskaHawaiianAir"],
        rate: 3,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
  },
  {
    id: "bilt-palladium",
    name: "Bilt Palladium Card",
    issuer: "Bilt",
    audience: "personal",
    applyUrl: "https://www.bilt.com/",
    annualFee: 495,
    rewardType: "points",
    rewardUnit: "Bilt points",
    centsPerUnit: 1.5,
    defaultRate: 2,
    rules: [
      {
        categories: ["rentMortgage"],
        rate: 1.25,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
    notes: ["This model values the points-earning path and does not add any optional Bilt Cash rebates."],
  },
  {
    id: "venture-x",
    name: "Capital One Venture X Rewards",
    issuer: "Capital One",
    audience: "personal",
    applyUrl: "https://www.capitalone.com/credit-cards/venture-x/",
    annualFee: 395,
    rewardType: "points",
    rewardUnit: "Capital One miles",
    centsPerUnit: 1,
    defaultRate: 2,
    rules: [],
    sourceUrls: [TPG_BEST_CARDS_URL, "https://www.capitalone.com/credit-cards/venture-x/"],
    notes: [
      "Capital One Travel portal bonuses are not modeled because uploaded statements do not reliably identify portal bookings.",
    ],
  },
  {
    id: "venture-x-business",
    name: "Capital One Venture X Business",
    issuer: "Capital One",
    audience: "business",
    applyUrl: "https://www.capitalone.com/small-business/credit-cards/",
    annualFee: 395,
    rewardType: "points",
    rewardUnit: "Capital One miles",
    centsPerUnit: 1,
    defaultRate: 2,
    rules: [],
    sourceUrls: [TPG_BEST_CARDS_URL],
    notes: [
      "Capital One Travel portal bonuses are not modeled because uploaded statements do not reliably identify portal bookings.",
    ],
  },
  {
    id: "sapphire-reserve-business",
    name: "Chase Sapphire Reserve for Business",
    issuer: "Chase",
    audience: "business",
    applyUrl: "https://creditcards.chase.com/business-credit-cards/sapphire/reserve",
    annualFee: 795,
    rewardType: "points",
    rewardUnit: "Ultimate Rewards points",
    centsPerUnit: 1.5,
    defaultRate: 1,
    rules: [
      {
        categories: ["travel", "hotels"],
        rate: 4,
      },
      {
        categories: ["advertising"],
        rate: 3,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
    notes: ["Social and search advertising is approximated from merchant descriptions such as Google Ads and Meta Ads."],
  },
  {
    id: "amex-platinum",
    name: "The Platinum Card from American Express",
    issuer: "American Express",
    audience: "personal",
    applyUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/",
    annualFee: 895,
    rewardType: "points",
    rewardUnit: "Membership Rewards points",
    centsPerUnit: 1.5,
    defaultRate: 1,
    rules: [
      {
        categories: ["deltaAir", "alaskaHawaiianAir", "travel", "hotels"],
        rate: 5,
        spendCap: 500000,
        capPeriod: "year",
      },
    ],
    sourceUrls: [
      TPG_BEST_CARDS_URL,
      "https://www.americanexpress.com/us/credit-cards/card/platinum/",
    ],
    notes: ["Travel bonuses are approximated from merchant descriptions and may not perfectly match issuer eligibility rules for direct airfare and prepaid hotel bookings."],
  },
  {
    id: "business-platinum",
    name: "The Business Platinum Card from American Express",
    issuer: "American Express",
    audience: "business",
    applyUrl:
      "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/",
    annualFee: 695,
    rewardType: "points",
    rewardUnit: "Membership Rewards points",
    centsPerUnit: 1.5,
    defaultRate: 1,
    rules: [
      {
        categories: ["deltaAir", "alaskaHawaiianAir", "travel", "hotels"],
        rate: 5,
      },
      {
        categories: ["utilities", "shipping"],
        rate: 1.5,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
    notes: ["Large-purchase and Amex Travel-specific bonuses are only partially modeled from bank-statement merchant data."],
  },
  {
    id: "sapphire-reserve",
    name: "Chase Sapphire Reserve",
    issuer: "Chase",
    audience: "personal",
    applyUrl: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    annualFee: 795,
    rewardType: "points",
    rewardUnit: "Ultimate Rewards points",
    centsPerUnit: 1.5,
    defaultRate: 1,
    rules: [
      {
        categories: ["dining"],
        rate: 3,
      },
      {
        categories: ["travel", "hotels"],
        rate: 4,
      },
    ],
    sourceUrls: [
      TPG_BEST_CARDS_URL,
      "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    ],
    notes: [
      "Chase Travel portal bonuses are not modeled because uploaded statements do not reliably identify portal bookings.",
    ],
  },
  {
    id: "atmos-summit",
    name: "Atmos Rewards Summit Visa Infinite credit card",
    issuer: "Bank of America",
    audience: "personal",
    applyUrl: "https://thepointsguy.com/credit-cards/best/",
    annualFee: 1,
    rewardType: "points",
    rewardUnit: "Atmos points",
    centsPerUnit: 1,
    defaultRate: 1,
    rules: [
      {
        categories: ["dining", "alaskaHawaiianAir"],
        rate: 3,
      },
    ],
    sourceUrls: [TPG_BEST_CARDS_URL],
  },
];

export function getCardById(cardId: string) {
  return CREDIT_CARDS.find((card) => card.id === cardId) ?? null;
}
