import {
  findRides,
  getJockeyProfile,
  listJockeySummaries,
  type JockeyProfile,
  type JockeySummary,
  type RaceEntry,
  type RaceFilterOptions,
} from "./jockeys";

type AgentParameterType = "string" | "number" | "boolean";

export interface AgentFunctionParameter {
  type: AgentParameterType;
  description: string;
  required?: boolean;
  enum?: string[];
}

export interface AgentFunctionDefinition<Args, Result> {
  name: string;
  description: string;
  parameters: Record<string, AgentFunctionParameter>;
  execute: (args: Args) => Promise<Result>;
}

type ListJockeyArgs = {
  limit?: number;
};

type JockeyProfileArgs = {
  identifier: string;
};

type RaceSearchArgs = RaceFilterOptions;

const safeLimit = (value?: number): number | undefined => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return undefined;
  }

  const integer = Math.floor(value);

  if (integer <= 0) {
    return undefined;
  }

  return integer;
};

export const listJockeysFunction: AgentFunctionDefinition<ListJockeyArgs, JockeySummary[]> = {
  name: "list_jockeys",
  description: "Return high level summaries for jockeys in the dataset.",
  parameters: {
    limit: {
      type: "number",
      description: "Maximum number of jockey summaries to return. Leave undefined for all jockeys.",
    },
  },
  async execute({ limit }) {
    const summaries = await listJockeySummaries();
    const cappedLimit = safeLimit(limit);

    if (cappedLimit) {
      return summaries.slice(0, cappedLimit);
    }

    return summaries;
  },
};

export const getJockeyProfileFunction: AgentFunctionDefinition<JockeyProfileArgs, JockeyProfile | null> = {
  name: "get_jockey_profile",
  description: "Fetch a detailed view of a single jockey using their slug or full name.",
  parameters: {
    identifier: {
      type: "string",
      description: "The jockey slug (e.g. 'alex-hearn') or their full name.",
      required: true,
    },
  },
  async execute({ identifier }) {
    return getJockeyProfile(identifier);
  },
};

export const searchRidesFunction: AgentFunctionDefinition<RaceSearchArgs, RaceEntry[]> = {
  name: "search_rides",
  description:
    "Search for race rides using flexible filters such as race date, venue, horse, trainer, or jockey.",
  parameters: {
    date: {
      type: "string",
      description: "Filter by race date. Accepts natural language or ISO date strings.",
    },
    venue: {
      type: "string",
      description: "Filter by venue name or partial venue text.",
    },
    horse: {
      type: "string",
      description: "Filter by horse name or partial horse text.",
    },
    trainer: {
      type: "string",
      description: "Filter by trainer name or partial trainer text.",
    },
    jockey: {
      type: "string",
      description: "Restrict results to a specific jockey (slug or full name).",
    },
    limit: {
      type: "number",
      description: "Maximum number of race results to return.",
    },
  },
  async execute({ limit, ...filters }) {
    const cappedLimit = safeLimit(limit);
    const results = await findRides({ ...filters, limit: cappedLimit });
    return results;
  },
};

export const aiAgentFunctions: AgentFunctionDefinition<any, any>[] = [
  listJockeysFunction,
  getJockeyProfileFunction,
  searchRidesFunction,
];
