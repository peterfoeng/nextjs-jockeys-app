import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

export interface RaceRunner {
  horse: string;
  jockey: string;
  claimedWeight: number | null;
  trainer: string;
  barrier: string;
  weight: string;
  sp: number;
}

export interface RaceEvent {
  title: string;
  grade: string;
  trackType: string;
  trackCondition: string;
  distance: number;
  runners: RaceRunner[];
  originalFieldSize: number;
  scratched: number;
}

export interface RaceVenueInfo {
  name: string;
  location: string;
  clubName: string;
  date: string;
  sourceUrl: string;
}

export interface RaceVenueData {
  venueInfo: RaceVenueInfo;
  races: RaceEvent[];
}

export interface JockeyDerivedStats {
  totalRides: number;
  totalWins: number;
  totalPlaces: number;
  winRate: number;
  placeRate: number;
  daysSinceLastWin: number | null;
  recentForm: string;
  currentStreak?: {
    type: string;
    count: number;
  };
}

export interface JockeyRaceStat {
  raceDate: string;
  raceTitle: string;
  raceVenue: string;
  raceNumber: number;
  raceGrade: string;
  distance: number;
  horse: string;
  trainerName: string;
  spValue: number;
  spString: string;
  weight: number;
  claimedWeight: number | null;
  finishingPosition: number;
  barrier: number;
  fieldSize: number;
  trackType: string;
  trackCondition: string;
  originalFieldSize: number;
  scratchedHorses: number;
}

export interface JockeyProfile {
  name: string;
  isFemale: boolean;
  rank: string;
  location: string;
  age: string;
  stats: JockeyRaceStat[];
  derived?: JockeyDerivedStats;
}

export interface RaceNavigationVenue {
  slug: string;
  name: string;
}

export interface RaceNavigationNode {
  date: string;
  venues: RaceNavigationVenue[];
}

export interface DashboardSummary {
  date: string;
  totalVenues: number;
  totalRaces: number;
  totalRunners: number;
  uniqueJockeys: number;
  venues: {
    slug: string;
    name: string;
    raceCount: number;
    runnerCount: number;
  }[];
}

export interface JockeySummary {
  name: string;
  slug: string;
  ridesToday: number;
  venues: string[];
  profile?: JockeyProfile | null;
}

const racesRoot = path.join(process.cwd(), "data", "races");
const jockeysRoot = path.join(process.cwd(), "data", "jockeys");

const readDirCached = cache(async (dir: string) =>
  fs.readdir(dir, { withFileTypes: true }),
);

export const getAvailableRaceDates = cache(async (): Promise<string[]> => {
  try {
    const entries = await readDirCached(racesRoot);
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => b.localeCompare(a));
  } catch (error) {
    console.error("Unable to read races directory", error);
    return [];
  }
});

export const getRaceNavigationTree = cache(
  async (): Promise<RaceNavigationNode[]> => {
    const dates = await getAvailableRaceDates();
    const nodes: RaceNavigationNode[] = [];

    for (const date of dates) {
      const venues = await getVenuesForDate(date);
      const venueNodes: RaceNavigationVenue[] = [];

      for (const slug of venues) {
        const data = await loadRaceVenue(date, slug);
        if (data) {
          venueNodes.push({
            slug,
            name: data.venueInfo.name || formatVenueSlug(slug),
          });
        }
      }

      nodes.push({
        date,
        venues: venueNodes,
      });
    }

    return nodes;
  },
);

export const getVenuesForDate = cache(
  async (date: string): Promise<string[]> => {
    const dateDir = path.join(racesRoot, date);
    try {
      const entries = await readDirCached(dateDir);
      return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map((entry) => entry.name.replace(/\.json$/, ""))
        .sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.error(`Unable to read race venues for ${date}`, error);
      return [];
    }
  },
);

export const loadRaceVenue = cache(
  async (date: string, venueSlug: string): Promise<RaceVenueData | null> => {
    const filePath = path.join(racesRoot, date, `${venueSlug}.json`);
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      return JSON.parse(fileContent) as RaceVenueData;
    } catch (error) {
      console.error(`Unable to read race file ${filePath}`, error);
      return null;
    }
  },
);

export const getLatestRaceDate = cache(async (): Promise<string | null> => {
  const dates = await getAvailableRaceDates();
  return dates.length > 0 ? dates[0] : null;
});

export const getDashboardSummary = cache(
  async (date: string): Promise<DashboardSummary | null> => {
    const venues = await getVenuesForDate(date);
    if (venues.length === 0) {
      return null;
    }

    let totalRaces = 0;
    let totalRunners = 0;
    const jockeys = new Set<string>();
    const venueSummaries: DashboardSummary["venues"] = [];

    for (const slug of venues) {
      const data = await loadRaceVenue(date, slug);
      if (!data) continue;

      let venueRunners = 0;

      for (const race of data.races) {
        totalRaces += 1;
        venueRunners += race.runners.length;
        totalRunners += race.runners.length;
        for (const runner of race.runners) {
          if (runner.jockey) {
            jockeys.add(runner.jockey);
          }
        }
      }

      venueSummaries.push({
        slug,
        name: data.venueInfo.name || formatVenueSlug(slug),
        raceCount: data.races.length,
        runnerCount: venueRunners,
      });
    }

    return {
      date,
      totalVenues: venues.length,
      totalRaces,
      totalRunners,
      uniqueJockeys: jockeys.size,
      venues: venueSummaries,
    };
  },
);

export const getJockeySummariesForDate = cache(
  async (date: string): Promise<JockeySummary[]> => {
    const venues = await getVenuesForDate(date);
    if (venues.length === 0) {
      return [];
    }

    const jockeyMap = new Map<string, { rides: number; venues: Set<string> }>();

    for (const slug of venues) {
      const data = await loadRaceVenue(date, slug);
      if (!data) continue;
      const venueName = data.venueInfo.name || formatVenueSlug(slug);

      for (const race of data.races) {
        for (const runner of race.runners) {
          if (!runner.jockey) continue;
          const entry = jockeyMap.get(runner.jockey) ?? {
            rides: 0,
            venues: new Set<string>(),
          };
          entry.rides += 1;
          entry.venues.add(venueName);
          jockeyMap.set(runner.jockey, entry);
        }
      }
    }

    const summaries: JockeySummary[] = [];

    for (const [name, value] of jockeyMap.entries()) {
      const slug = slugifyName(name);
      const profile = await loadJockeyProfile(slug);
      summaries.push({
        name,
        slug,
        ridesToday: value.rides,
        venues: Array.from(value.venues).sort((a, b) => a.localeCompare(b)),
        profile,
      });
    }

    return summaries.sort((a, b) => a.name.localeCompare(b.name));
  },
);

export const loadJockeyProfile = cache(
  async (slug: string): Promise<JockeyProfile | null> => {
    const filePath = path.join(jockeysRoot, `${slug}.json`);
    try {
      const content = await fs.readFile(filePath, "utf8");
      return JSON.parse(content) as JockeyProfile;
    } catch (_error) {
      return null;
    }
  },
);

export function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatVenueSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatIsoDate(date: string): string {
  try {
    const iso = new Date(date);
    if (Number.isNaN(iso.getTime())) {
      return date;
    }
    return new Intl.DateTimeFormat("en-AU", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(iso);
  } catch {
    return date;
  }
}
