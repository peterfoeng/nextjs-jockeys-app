import { promises as fs } from "node:fs";
import path from "node:path";

export interface JockeyRace {
  raceDate: string;
  raceTitle: string;
  raceVenue: string;
  raceNumber: number | null;
  raceGrade: string | null;
  distance: number | null;
  horse: string;
  trainerName: string | null;
  spValue: number | null;
  spString: string | null;
  weight: number | null;
  claimedWeight: number | null;
  finishingPosition: number | null;
  barrier: number | null;
  fieldSize: number | null;
  trackType: string | null;
  trackCondition: string | null;
  originalFieldSize: number | null;
  scratchedHorses: number | null;
}

export interface JockeyStreak {
  type: "winning" | "losing" | "neutral" | "unknown";
  count: number;
}

export interface JockeyDerived {
  totalRides: number;
  totalWins: number;
  totalPlaces: number;
  winRate: number;
  placeRate: number;
  daysSinceLastWin: number | null;
  recentForm: string | null;
  currentStreak: JockeyStreak | null;
}

export interface JockeyProfile {
  name: string;
  isFemale: boolean;
  rank: string;
  location: string;
  age: string;
  stats: JockeyRace[];
  derived: JockeyDerived | null;
}

export interface JockeyWithSlug extends JockeyProfile {
  slug: string;
}

const DATA_DIRECTORY = path.join(process.cwd(), "data", "jockeys");
const DEFAULT_TIME_ZONE = "Australia/Sydney";

export function getCurrentDateKey(
  timeZone: string = DEFAULT_TIME_ZONE,
): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

export function formatDateKey(
  dateKey: string,
  format: Intl.DateTimeFormatOptions = { dateStyle: "long" },
  timeZone: string = DEFAULT_TIME_ZONE,
): string {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat("en-AU", { ...format, timeZone }).format(date);
}

export function formatAsPercent(value: number, fractionDigits = 1): string {
  return new Intl.NumberFormat("en-AU", {
    style: "percent",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export async function getAllJockeySlugs(): Promise<string[]> {
  const entries = await fs.readdir(DATA_DIRECTORY, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name.replace(/\.json$/, ""))
    .sort((a, b) => a.localeCompare(b));
}

export async function getAllJockeys(): Promise<JockeyWithSlug[]> {
  const slugs = await getAllJockeySlugs();
  const results = await Promise.all(slugs.map((slug) => getJockeyBySlug(slug)));
  return results.filter(
    (profile): profile is JockeyWithSlug => profile !== null,
  );
}

export async function getJockeyBySlug(
  slug: string,
): Promise<JockeyWithSlug | null> {
  const filePath = path.join(DATA_DIRECTORY, `${slug}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const profile = mapToJockeyProfile(parsed, slug);
    return profile;
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function mapToJockeyProfile(
  data: unknown,
  slug: string,
): JockeyWithSlug | null {
  if (!isRecord(data)) {
    return null;
  }

  const { name, isFemale, rank, location, age, stats, derived } = data;

  if (typeof name !== "string" || !Array.isArray(stats)) {
    return null;
  }

  const parsedStats = stats
    .map((item) => mapToRace(item))
    .filter((race): race is JockeyRace => race !== null);

  const parsedDerived = mapToDerived(derived);

  return {
    slug,
    name,
    isFemale: typeof isFemale === "boolean" ? isFemale : false,
    rank: typeof rank === "string" ? rank : "",
    location: typeof location === "string" ? location : "",
    age: typeof age === "string" ? age : "",
    stats: parsedStats,
    derived: parsedDerived,
  };
}

function mapToRace(value: unknown): JockeyRace | null {
  if (!isRecord(value)) {
    return null;
  }

  const raceDate = typeof value.raceDate === "string" ? value.raceDate : null;
  const raceTitle =
    typeof value.raceTitle === "string" ? value.raceTitle : null;
  const raceVenue =
    typeof value.raceVenue === "string" ? value.raceVenue : null;
  const horse = typeof value.horse === "string" ? value.horse : null;

  if (!raceDate || !raceTitle || !raceVenue || !horse) {
    return null;
  }

  return {
    raceDate,
    raceTitle,
    raceVenue,
    raceNumber: typeof value.raceNumber === "number" ? value.raceNumber : null,
    raceGrade: typeof value.raceGrade === "string" ? value.raceGrade : null,
    distance: typeof value.distance === "number" ? value.distance : null,
    horse,
    trainerName:
      typeof value.trainerName === "string" ? value.trainerName : null,
    spValue: typeof value.spValue === "number" ? value.spValue : null,
    spString: typeof value.spString === "string" ? value.spString : null,
    weight: typeof value.weight === "number" ? value.weight : null,
    claimedWeight:
      typeof value.claimedWeight === "number" ? value.claimedWeight : null,
    finishingPosition:
      typeof value.finishingPosition === "number"
        ? value.finishingPosition
        : null,
    barrier: typeof value.barrier === "number" ? value.barrier : null,
    fieldSize: typeof value.fieldSize === "number" ? value.fieldSize : null,
    trackType: typeof value.trackType === "string" ? value.trackType : null,
    trackCondition:
      typeof value.trackCondition === "string" ? value.trackCondition : null,
    originalFieldSize:
      typeof value.originalFieldSize === "number"
        ? value.originalFieldSize
        : null,
    scratchedHorses:
      typeof value.scratchedHorses === "number" ? value.scratchedHorses : null,
  };
}

function mapToDerived(value: unknown): JockeyDerived | null {
  if (!isRecord(value)) {
    return null;
  }

  const currentStreak = mapToStreak(value.currentStreak);

  return {
    totalRides: toNumber(value.totalRides),
    totalWins: toNumber(value.totalWins),
    totalPlaces: toNumber(value.totalPlaces),
    winRate: toNumber(value.winRate),
    placeRate: toNumber(value.placeRate),
    daysSinceLastWin:
      typeof value.daysSinceLastWin === "number"
        ? value.daysSinceLastWin
        : null,
    recentForm: typeof value.recentForm === "string" ? value.recentForm : null,
    currentStreak,
  };
}

function mapToStreak(value: unknown): JockeyStreak | null {
  if (!isRecord(value)) {
    return null;
  }

  const rawType = value.type;
  const allowed: JockeyStreak["type"][] = ["winning", "losing", "neutral"];
  const type = allowed.includes(rawType as JockeyStreak["type"])
    ? (rawType as JockeyStreak["type"])
    : "unknown";

  return {
    type,
    count: toNumber(value.count),
  };
}

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
