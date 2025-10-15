import { promises as fs } from "node:fs";
import path from "node:path";

export interface RaceStat {
  raceDate: string;
  raceVenue: string;
  horse: string;
  trainerName: string;
  sp: string;
  weight: string;
  finishingPosition: number | null;
  raceTitle: string;
  raceDateKey: string | null;
  raceTimestamp: number | null;
}

export interface JockeySummary {
  slug: string;
  name: string;
  rank: string;
  location: string;
  age: string;
  totalRides: number;
  wins: number;
  topThreeFinishes: number;
  winPercentage: number;
  placePercentage: number;
  averageFinish: number | null;
  firstRaceDate: string | null;
  lastRaceDate: string | null;
  favouriteVenue: string | null;
  favouriteHorse: string | null;
}

export interface JockeyProfile {
  slug: string;
  name: string;
  rank: string;
  location: string;
  age: string;
  stats: RaceStat[];
  summary: JockeySummary;
}

export interface RaceFilterOptions {
  date?: string;
  venue?: string;
  horse?: string;
  trainer?: string;
  jockey?: string;
  limit?: number;
}

export interface RaceEntry extends RaceStat {
  jockeyName: string;
  jockeySlug: string;
  jockeyRank: string;
}

interface RawRaceStat {
  raceDate?: unknown;
  raceVenue?: unknown;
  horse?: unknown;
  trainerName?: unknown;
  sp?: unknown;
  weight?: unknown;
  finishingPosition?: unknown;
  raceTitle?: unknown;
}

interface RawJockeyProfile {
  name?: unknown;
  rank?: unknown;
  location?: unknown;
  age?: unknown;
  stats?: unknown;
}

const DATA_DIRECTORY = path.join(process.cwd(), "data", "jockeys");
let cache: Map<string, JockeyProfile> | null = null;

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toStringOrEmpty = (value: unknown): string =>
  typeof value === "string" ? value : "";

const toNumberOrNull = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
};

const toDateKey = (value: string): { key: string; timestamp: number } | null => {
  const parsed = new Date(value);
  const timestamp = parsed.getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  const key = parsed.toISOString().slice(0, 10);

  return { key, timestamp };
};

const buildRaceStat = (raw: RawRaceStat): RaceStat => {
  const raceDate = toStringOrEmpty(raw.raceDate);
  const dateMeta = raceDate ? toDateKey(raceDate) : null;

  return {
    raceDate,
    raceVenue: toStringOrEmpty(raw.raceVenue),
    horse: toStringOrEmpty(raw.horse),
    trainerName: toStringOrEmpty(raw.trainerName),
    sp: toStringOrEmpty(raw.sp),
    weight: toStringOrEmpty(raw.weight),
    finishingPosition: toNumberOrNull(raw.finishingPosition),
    raceTitle: toStringOrEmpty(raw.raceTitle),
    raceDateKey: dateMeta?.key ?? null,
    raceTimestamp: dateMeta?.timestamp ?? null,
  };
};

const computeSummary = (slug: string, raw: RawJockeyProfile, stats: RaceStat[]): JockeySummary => {
  const totalRides = stats.filter((stat) => stat.finishingPosition !== null).length;
  const wins = stats.filter((stat) => stat.finishingPosition === 1).length;
  const topThreeFinishes = stats.filter(
    (stat) => stat.finishingPosition !== null && stat.finishingPosition <= 3,
  ).length;

  const averageFinish = totalRides
    ? Number.parseFloat(
        (
          stats.reduce((sum, stat) => sum + (stat.finishingPosition ?? 0), 0) /
          totalRides
        ).toFixed(2),
      )
    : null;

  const sortedByDate = [...stats]
    .filter((stat) => stat.raceTimestamp !== null)
    .sort((a, b) => (a.raceTimestamp ?? 0) - (b.raceTimestamp ?? 0));

  const firstRaceDate = sortedByDate[0]?.raceDate ?? null;
  const lastRaceDate = sortedByDate[sortedByDate.length - 1]?.raceDate ?? null;

  const venueCounts = new Map<string, number>();
  const horseCounts = new Map<string, number>();

  for (const stat of stats) {
    if (stat.raceVenue) {
      venueCounts.set(stat.raceVenue, (venueCounts.get(stat.raceVenue) ?? 0) + 1);
    }

    if (stat.horse) {
      horseCounts.set(stat.horse, (horseCounts.get(stat.horse) ?? 0) + 1);
    }
  }

  const favouriteVenue = Array.from(venueCounts.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  )[0]?.[0] ?? null;
  const favouriteHorse = Array.from(horseCounts.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  )[0]?.[0] ?? null;

  const winPercentage = totalRides ? Number.parseFloat(((wins / totalRides) * 100).toFixed(2)) : 0;
  const placePercentage = totalRides
    ? Number.parseFloat(((topThreeFinishes / totalRides) * 100).toFixed(2))
    : 0;

  return {
    slug,
    name: toStringOrEmpty(raw.name) || slug,
    rank: toStringOrEmpty(raw.rank),
    location: toStringOrEmpty(raw.location),
    age: toStringOrEmpty(raw.age),
    totalRides,
    wins,
    topThreeFinishes,
    winPercentage,
    placePercentage,
    averageFinish,
    firstRaceDate,
    lastRaceDate,
    favouriteVenue,
    favouriteHorse,
  };
};

const loadProfiles = async (): Promise<Map<string, JockeyProfile>> => {
  if (cache) {
    return cache;
  }

  const entries: Array<[string, JockeyProfile]> = [];
  const files = await fs.readdir(DATA_DIRECTORY);

  for (const fileName of files) {
    if (!fileName.endsWith(".json")) {
      continue;
    }

    const slug = fileName.replace(/\.json$/, "");
    const filePath = path.join(DATA_DIRECTORY, fileName);

    try {
      const rawContent = await fs.readFile(filePath, "utf-8");
      const rawData = JSON.parse(rawContent) as RawJockeyProfile;
      const rawStats = Array.isArray(rawData.stats) ? rawData.stats : [];
      const stats = rawStats.map((stat) => buildRaceStat(stat as RawRaceStat));

      const summary = computeSummary(slug, rawData, stats);

      entries.push([
        slug,
        {
          slug,
          name: summary.name,
          rank: summary.rank,
          location: summary.location,
          age: summary.age,
          stats: stats.sort((a, b) => (b.raceTimestamp ?? 0) - (a.raceTimestamp ?? 0)),
          summary,
        },
      ]);
    } catch (error) {
      console.error(`Failed to load jockey data from ${filePath}:`, error);
    }
  }

  cache = new Map(entries);
  return cache;
};

export const clearJockeyCache = () => {
  cache = null;
};

export const listJockeySummaries = async (): Promise<JockeySummary[]> => {
  const profiles = await loadProfiles();
  return Array.from(profiles.values())
    .map((profile) => profile.summary)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getJockeyProfile = async (identifier: string): Promise<JockeyProfile | null> => {
  const profiles = await loadProfiles();
  const normalized = slugify(identifier);

  if (profiles.has(normalized)) {
    return profiles.get(normalized) ?? null;
  }

  const match = Array.from(profiles.values()).find(
    (profile) => slugify(profile.name) === normalized,
  );

  return match ?? null;
};

export const findRides = async (options: RaceFilterOptions = {}): Promise<RaceEntry[]> => {
  const { date, venue, horse, trainer, jockey, limit } = options;

  const normalizedDate = date ? toDateKey(date)?.key : null;
  const normalizedVenue = venue?.toLowerCase().trim();
  const normalizedHorse = horse?.toLowerCase().trim();
  const normalizedTrainer = trainer?.toLowerCase().trim();
  const normalizedJockey = jockey ? slugify(jockey) : null;

  const profiles = await loadProfiles();
  const results: RaceEntry[] = [];

  for (const profile of profiles.values()) {
    if (normalizedJockey && profile.slug !== normalizedJockey && slugify(profile.name) !== normalizedJockey) {
      continue;
    }

    for (const stat of profile.stats) {
      if (normalizedDate && stat.raceDateKey !== normalizedDate) {
        continue;
      }

      if (normalizedVenue && !stat.raceVenue.toLowerCase().includes(normalizedVenue)) {
        continue;
      }

      if (normalizedHorse && !stat.horse.toLowerCase().includes(normalizedHorse)) {
        continue;
      }

      if (normalizedTrainer && !stat.trainerName.toLowerCase().includes(normalizedTrainer)) {
        continue;
      }

      results.push({
        ...stat,
        jockeyName: profile.name,
        jockeySlug: profile.slug,
        jockeyRank: profile.rank,
      });
    }
  }

  results.sort((a, b) => {
    const timeDelta = (b.raceTimestamp ?? 0) - (a.raceTimestamp ?? 0);

    if (timeDelta !== 0) {
      return timeDelta;
    }

    if (a.finishingPosition !== null && b.finishingPosition !== null) {
      return a.finishingPosition - b.finishingPosition;
    }

    return a.raceTitle.localeCompare(b.raceTitle);
  });

  if (limit && limit > 0) {
    return results.slice(0, limit);
  }

  return results;
};

export const listVenues = async (): Promise<string[]> => {
  const profiles = await loadProfiles();
  const venues = new Set<string>();

  for (const profile of profiles.values()) {
    for (const stat of profile.stats) {
      if (stat.raceVenue) {
        venues.add(stat.raceVenue);
      }
    }
  }

  return Array.from(venues).sort((a, b) => a.localeCompare(b));
};

export const listHorses = async (): Promise<string[]> => {
  const profiles = await loadProfiles();
  const horses = new Set<string>();

  for (const profile of profiles.values()) {
    for (const stat of profile.stats) {
      if (stat.horse) {
        horses.add(stat.horse);
      }
    }
  }

  return Array.from(horses).sort((a, b) => a.localeCompare(b));
};
