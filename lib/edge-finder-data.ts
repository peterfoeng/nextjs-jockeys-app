export interface ConditionProfile {
  trackCondition: "firm" | "good" | "soft" | "heavy";
  winRate: number;
  avgROI: number; // Return on investment if backing at odds
  sampleSize: number;
}

export interface EdgeAnalysis {
  jockeyId: string;
  jockeyName: string;
  photo: string;
  venue: string;
  race: number;
  horse: string;
  odds: string;
  edgeScore: number; // 0-100, higher = better edge
  edgeType: "conditions" | "distance" | "trainer" | "venue" | "form" | "multi";
  edgeFactors: {
    factor: string;
    value: string;
    impact: "positive" | "negative" | "neutral";
    description: string;
  }[];
  confidenceLevel: "high" | "medium" | "low";
  expectedValue: number; // Positive = value bet
  historicalWinRate: number;
  impliedProbability: number;
  trueEstimatedProbability: number;
}

export interface HeadToHead {
  jockey1: {
    id: string;
    name: string;
    photo: string;
    wins: number;
  };
  jockey2: {
    id: string;
    name: string;
    photo: string;
    wins: number;
  };
  totalRaces: number;
  lastMeeting: string;
  lastWinner: string;
}

export interface TrackConditionStats {
  jockeyId: string;
  jockeyName: string;
  photo: string;
  firm: { winRate: number; starts: number; roi: number };
  good: { winRate: number; starts: number; roi: number };
  soft: { winRate: number; starts: number; roi: number };
  heavy: { winRate: number; starts: number; roi: number };
}

export interface DistanceSpecialist {
  jockeyId: string;
  jockeyName: string;
  photo: string;
  distance: string;
  winRate: number;
  placeRate: number;
  avgMargin: string;
  bestResult: string;
}

// Generate edge analyses for today's races
export const todaysEdges: EdgeAnalysis[] = [
  {
    jockeyId: "j-mcdonald",
    jockeyName: "James McDonald",
    photo: "/professional-jockey-portrait-male.jpg",
    venue: "Flemington",
    race: 3,
    horse: "Champion Spirit",
    odds: "$3.00",
    edgeScore: 87,
    edgeType: "multi",
    edgeFactors: [
      {
        factor: "Track Condition",
        value: "Good 4",
        impact: "positive",
        description: "31.2% win rate on Good tracks vs 28.5% overall",
      },
      {
        factor: "Distance",
        value: "1600m",
        impact: "positive",
        description: "Best distance bracket with 27.3% win rate",
      },
      {
        factor: "Trainer Partnership",
        value: "C. Waller",
        impact: "positive",
        description: "37.1% strike rate with this trainer",
      },
      {
        factor: "Recent Form",
        value: "Won 2 days ago",
        impact: "positive",
        description: "In career-best form currently",
      },
    ],
    confidenceLevel: "high",
    expectedValue: 0.24,
    historicalWinRate: 31.2,
    impliedProbability: 33.3,
    trueEstimatedProbability: 41.3,
  },
  {
    jockeyId: "j-kah",
    jockeyName: "Jamie Kah",
    photo: "/female-jockey-portrait-professional.jpg",
    venue: "Flemington",
    race: 5,
    horse: "Desert Rose",
    odds: "$3.20",
    edgeScore: 82,
    edgeType: "venue",
    edgeFactors: [
      {
        factor: "Venue Specialist",
        value: "Flemington",
        impact: "positive",
        description: "29.8% win rate at Flemington, best of all venues",
      },
      {
        factor: "Track Condition",
        value: "Good 4",
        impact: "positive",
        description: "Excellent record on Good tracks",
      },
      {
        factor: "Hot Streak",
        value: "Won yesterday",
        impact: "positive",
        description: "6 wins from last 20 rides",
      },
    ],
    confidenceLevel: "high",
    expectedValue: 0.18,
    historicalWinRate: 29.8,
    impliedProbability: 31.3,
    trueEstimatedProbability: 36.9,
  },
  {
    jockeyId: "d-oliver",
    jockeyName: "Damien Oliver",
    photo: "/senior-jockey-portrait-male-veteran.jpg",
    venue: "Eagle Farm",
    race: 4,
    horse: "Palm Beach",
    odds: "$3.80",
    edgeScore: 78,
    edgeType: "conditions",
    edgeFactors: [
      {
        factor: "Track Condition",
        value: "Soft 5",
        impact: "positive",
        description: "32.5% win rate on Soft tracks - well above average",
      },
      {
        factor: "Experience",
        value: "126 G1 wins",
        impact: "positive",
        description: "Big race experience invaluable on tricky tracks",
      },
      {
        factor: "Distance",
        value: "2000m",
        impact: "positive",
        description: "28.4% win rate at staying distances",
      },
    ],
    confidenceLevel: "medium",
    expectedValue: 0.15,
    historicalWinRate: 28.2,
    impliedProbability: 26.3,
    trueEstimatedProbability: 30.3,
  },
  {
    jockeyId: "c-williams",
    jockeyName: "Craig Williams",
    photo: "/professional-jockey-portrait-male-australian.jpg",
    venue: "Morphettville",
    race: 3,
    horse: "Wine Country",
    odds: "$4.20",
    edgeScore: 75,
    edgeType: "trainer",
    edgeFactors: [
      {
        factor: "Trainer Partnership",
        value: "A. Cummings",
        impact: "positive",
        description: "28.7% win rate with this trainer, 89 wins together",
      },
      {
        factor: "Recent Form",
        value: "Won 3 days ago",
        impact: "positive",
        description: "6 wins from last 25 rides",
      },
    ],
    confidenceLevel: "medium",
    expectedValue: 0.12,
    historicalWinRate: 25.8,
    impliedProbability: 23.8,
    trueEstimatedProbability: 26.7,
  },
  {
    jockeyId: "h-bowman",
    jockeyName: "Hugh Bowman",
    photo: "/professional-jockey-portrait-asian.jpg",
    venue: "Randwick",
    race: 5,
    horse: "Coastal King",
    odds: "$6.50",
    edgeScore: 71,
    edgeType: "distance",
    edgeFactors: [
      {
        factor: "Distance Specialist",
        value: "1400m",
        impact: "positive",
        description: "27.8% win rate at this distance",
      },
      {
        factor: "Venue",
        value: "Royal Randwick",
        impact: "positive",
        description: "Home track advantage, 26.5% win rate here",
      },
    ],
    confidenceLevel: "medium",
    expectedValue: 0.09,
    historicalWinRate: 18.2,
    impliedProbability: 15.4,
    trueEstimatedProbability: 16.8,
  },
  {
    jockeyId: "d-lane",
    jockeyName: "Damian Lane",
    photo: "/professional-jockey-portrait-young.jpg",
    venue: "Eagle Farm",
    race: 3,
    horse: "Gold Coast",
    odds: "$2.80",
    edgeScore: 85,
    edgeType: "form",
    edgeFactors: [
      {
        factor: "Current Form",
        value: "4 wins last 10",
        impact: "positive",
        description: "Strike rate of 40% in recent rides",
      },
      {
        factor: "Track Condition",
        value: "Soft 5",
        impact: "positive",
        description: "29.5% win rate on Soft tracks",
      },
      {
        factor: "Trainer",
        value: "C. Waller",
        impact: "positive",
        description: "32.1% strike rate with this trainer",
      },
    ],
    confidenceLevel: "high",
    expectedValue: 0.21,
    historicalWinRate: 32.5,
    impliedProbability: 35.7,
    trueEstimatedProbability: 43.2,
  },
];

// Head to head comparisons for jockeys racing today
export const headToHeadData: HeadToHead[] = [
  {
    jockey1: {
      id: "j-mcdonald",
      name: "James McDonald",
      photo: "/professional-jockey-portrait-male.jpg",
      wins: 156,
    },
    jockey2: {
      id: "d-oliver",
      name: "Damien Oliver",
      photo: "/senior-jockey-portrait-male-veteran.jpg",
      wins: 142,
    },
    totalRaces: 298,
    lastMeeting: "Jan 4, 2026",
    lastWinner: "J. McDonald",
  },
  {
    jockey1: {
      id: "j-kah",
      name: "Jamie Kah",
      photo: "/female-jockey-portrait-professional.jpg",
      wins: 89,
    },
    jockey2: {
      id: "c-williams",
      name: "Craig Williams",
      photo: "/professional-jockey-portrait-male-australian.jpg",
      wins: 78,
    },
    totalRaces: 167,
    lastMeeting: "Jan 6, 2026",
    lastWinner: "J. Kah",
  },
  {
    jockey1: {
      id: "d-lane",
      name: "Damian Lane",
      photo: "/professional-jockey-portrait-young.jpg",
      wins: 65,
    },
    jockey2: {
      id: "h-bowman",
      name: "Hugh Bowman",
      photo: "/professional-jockey-portrait-asian.jpg",
      wins: 72,
    },
    totalRaces: 137,
    lastMeeting: "Jan 5, 2026",
    lastWinner: "H. Bowman",
  },
];

// Track condition specialists
export const trackConditionStats: TrackConditionStats[] = [
  {
    jockeyId: "j-mcdonald",
    jockeyName: "James McDonald",
    photo: "/professional-jockey-portrait-male.jpg",
    firm: { winRate: 26.8, starts: 420, roi: 0.92 },
    good: { winRate: 31.2, starts: 1850, roi: 1.15 },
    soft: { winRate: 28.5, starts: 680, roi: 1.02 },
    heavy: { winRate: 24.2, starts: 245, roi: 0.88 },
  },
  {
    jockeyId: "d-oliver",
    jockeyName: "Damien Oliver",
    photo: "/senior-jockey-portrait-male-veteran.jpg",
    firm: { winRate: 24.5, starts: 1520, roi: 0.95 },
    good: { winRate: 27.8, starts: 4250, roi: 1.08 },
    soft: { winRate: 32.5, starts: 1890, roi: 1.22 },
    heavy: { winRate: 29.8, starts: 785, roi: 1.18 },
  },
  {
    jockeyId: "j-kah",
    jockeyName: "Jamie Kah",
    photo: "/female-jockey-portrait-professional.jpg",
    firm: { winRate: 25.2, starts: 380, roi: 0.98 },
    good: { winRate: 29.8, starts: 1420, roi: 1.12 },
    soft: { winRate: 27.5, starts: 520, roi: 1.05 },
    heavy: { winRate: 23.8, starts: 180, roi: 0.85 },
  },
  {
    jockeyId: "c-williams",
    jockeyName: "Craig Williams",
    photo: "/professional-jockey-portrait-male-australian.jpg",
    firm: { winRate: 23.8, starts: 1280, roi: 0.92 },
    good: { winRate: 26.5, starts: 3850, roi: 1.05 },
    soft: { winRate: 28.2, starts: 1450, roi: 1.12 },
    heavy: { winRate: 25.5, starts: 620, roi: 0.98 },
  },
  {
    jockeyId: "d-lane",
    jockeyName: "Damian Lane",
    photo: "/professional-jockey-portrait-young.jpg",
    firm: { winRate: 24.8, starts: 520, roi: 0.95 },
    good: { winRate: 28.5, starts: 1680, roi: 1.1 },
    soft: { winRate: 29.5, starts: 580, roi: 1.15 },
    heavy: { winRate: 26.2, starts: 220, roi: 1.02 },
  },
  {
    jockeyId: "h-bowman",
    jockeyName: "Hugh Bowman",
    photo: "/professional-jockey-portrait-asian.jpg",
    firm: { winRate: 25.5, starts: 980, roi: 0.98 },
    good: { winRate: 27.2, starts: 2850, roi: 1.06 },
    soft: { winRate: 26.8, starts: 1120, roi: 1.02 },
    heavy: { winRate: 24.5, starts: 425, roi: 0.92 },
  },
];

// Distance specialists for today
export const distanceSpecialists: DistanceSpecialist[] = [
  {
    jockeyId: "j-mcdonald",
    jockeyName: "James McDonald",
    photo: "/professional-jockey-portrait-male.jpg",
    distance: "1300-1600m",
    winRate: 27.3,
    placeRate: 48.5,
    avgMargin: "1.2L",
    bestResult: "G1 Chipping Norton 1600m",
  },
  {
    jockeyId: "d-oliver",
    jockeyName: "Damien Oliver",
    photo: "/senior-jockey-portrait-male-veteran.jpg",
    distance: "2100m+",
    winRate: 28.4,
    placeRate: 49.2,
    avgMargin: "1.5L",
    bestResult: "3x Melbourne Cup 3200m",
  },
  {
    jockeyId: "j-kah",
    jockeyName: "Jamie Kah",
    photo: "/female-jockey-portrait-professional.jpg",
    distance: "1000-1200m",
    winRate: 28.2,
    placeRate: 47.8,
    avgMargin: "0.8L",
    bestResult: "G1 Newmarket 1200m",
  },
  {
    jockeyId: "h-bowman",
    jockeyName: "Hugh Bowman",
    photo: "/professional-jockey-portrait-asian.jpg",
    distance: "1700-2000m",
    winRate: 26.8,
    placeRate: 48.2,
    avgMargin: "1.8L",
    bestResult: "4x Cox Plate 2040m",
  },
];

export function calculateEdgeColor(score: number): string {
  if (score >= 80) return "text-primary";
  if (score >= 70) return "text-accent";
  if (score >= 60) return "text-yellow-500";
  return "text-muted-foreground";
}

export function calculateEdgeBg(score: number): string {
  if (score >= 80) return "bg-primary/20";
  if (score >= 70) return "bg-accent/20";
  if (score >= 60) return "bg-yellow-500/20";
  return "bg-muted/20";
}
