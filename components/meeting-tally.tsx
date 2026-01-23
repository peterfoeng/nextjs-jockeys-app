"use client";

import {
  Avatar,
  Badge,
  Group,
  Paper,
  Progress,
  ScrollArea,
  Table,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconChartBar,
  IconFlame,
  IconMedal,
  IconTarget,
  IconTrophy,
} from "@tabler/icons-react";
import Link from "next/link";
import { getJockeyIdFromShortName, jockeyProfiles } from "@/lib/jockey-data";
import type { Race } from "@/lib/race-data";

interface MeetingTallyProps {
  races: Race[];
  venueName: string;
}

interface JockeyMeetingStats {
  jockey: string;
  jockeyId: string;
  photo: string;
  rides: number;
  wins: number;
  places: number;
  winRate: number;
  placeRate: number;
  upcomingRides: number[];
  prizeMoney: number;
  bestOddsWin: number | null;
  isLeading: boolean;
  momentum: "hot" | "warm" | "cold";
}

// Simulated meeting results for completed races
const meetingResults: Record<
  number,
  { winner: string; second: string; third: string }
> = {
  1: { winner: "J. McDonald", second: "D. Oliver", third: "C. Williams" },
  2: { winner: "J. Kah", second: "D. Lane", third: "B. Melham" },
  3: { winner: "J. McDonald", second: "H. Bowman", third: "D. Oliver" },
  4: { winner: "C. Williams", second: "J. Kah", third: "K. McEvoy" },
};

export function MeetingTally({ races, venueName }: MeetingTallyProps) {
  // Collect all jockeys from all races
  const jockeyMap = new Map<string, JockeyMeetingStats>();

  // Initialize jockeys from all races
  races.forEach((race) => {
    race.participants.forEach((participant) => {
      const jockeyId = getJockeyIdFromShortName(participant.jockey);
      const profile = jockeyId ? jockeyProfiles[jockeyId] : null;

      if (!jockeyMap.has(participant.jockey)) {
        jockeyMap.set(participant.jockey, {
          jockey: participant.jockey,
          jockeyId: jockeyId || "",
          photo: profile?.photo || "/jockey-silhouette.jpg",
          rides: 0,
          wins: 0,
          places: 0,
          winRate: 0,
          placeRate: 0,
          upcomingRides: [],
          prizeMoney: 0,
          bestOddsWin: null,
          isLeading: false,
          momentum: "cold",
        });
      }

      const stats = jockeyMap.get(participant.jockey)!;
      stats.rides += 1;
      stats.upcomingRides.push(race.raceNumber);
    });
  });

  // Calculate results from completed races (simulated - R1-R4 completed)
  const completedRaces = [1, 2, 3, 4];
  const prizeMoney: Record<number, number> = {
    1: 50000,
    2: 75000,
    3: 100000,
    4: 125000,
  };

  completedRaces.forEach((raceNum) => {
    const result = meetingResults[raceNum];
    if (result) {
      // Winner
      if (jockeyMap.has(result.winner)) {
        const stats = jockeyMap.get(result.winner)!;
        stats.wins += 1;
        stats.prizeMoney += prizeMoney[raceNum] || 0;
      }
      // Second
      if (jockeyMap.has(result.second)) {
        const stats = jockeyMap.get(result.second)!;
        stats.places += 1;
        stats.prizeMoney += (prizeMoney[raceNum] || 0) * 0.2;
      }
      // Third
      if (jockeyMap.has(result.third)) {
        const stats = jockeyMap.get(result.third)!;
        stats.places += 1;
        stats.prizeMoney += (prizeMoney[raceNum] || 0) * 0.1;
      }
    }
  });

  // Calculate rates and momentum
  jockeyMap.forEach((stats) => {
    const completedRides = stats.upcomingRides.filter((r) =>
      completedRaces.includes(r),
    ).length;
    if (completedRides > 0) {
      stats.winRate = (stats.wins / completedRides) * 100;
      stats.placeRate = ((stats.wins + stats.places) / completedRides) * 100;
    }

    // Determine momentum
    if (stats.wins >= 2) {
      stats.momentum = "hot";
    } else if (stats.wins === 1 || stats.places >= 2) {
      stats.momentum = "warm";
    } else {
      stats.momentum = "cold";
    }
  });

  // Sort by wins, then places, then rides
  const sortedJockeys = Array.from(jockeyMap.values()).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.places !== a.places) return b.places - a.places;
    return b.rides - a.rides;
  });

  // Mark leader
  if (sortedJockeys.length > 0 && sortedJockeys[0].wins > 0) {
    sortedJockeys[0].isLeading = true;
  }

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case "hot":
        return <IconFlame size={14} className="text-orange-400" />;
      case "warm":
        return <IconTarget size={14} className="text-yellow-400" />;
      default:
        return null;
    }
  };

  const getMomentumColor = (momentum: string) => {
    switch (momentum) {
      case "hot":
        return "orange";
      case "warm":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <Paper className="bg-card border border-border rounded-xl p-6 mb-6">
      <Group justify="space-between" mb="lg">
        <Group gap="sm">
          <ThemeIcon
            size="lg"
            variant="light"
            color="green"
            className="bg-primary/20"
          >
            <IconChartBar size={20} />
          </ThemeIcon>
          <div>
            <Title order={4} className="text-foreground font-bold">
              Meeting Tally
            </Title>
            <Text size="sm" className="text-muted-foreground">
              Jockey standings at {venueName} today
            </Text>
          </div>
        </Group>
        <Badge
          variant="outline"
          className="border-border text-muted-foreground"
        >
          {completedRaces.length} of {races.length} races complete
        </Badge>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover className="min-w-[700px]">
          <Table.Thead>
            <Table.Tr className="bg-secondary/30">
              <Table.Th className="text-muted-foreground font-semibold text-xs uppercase tracking-wide py-3 px-4">
                Rank
              </Table.Th>
              <Table.Th className="text-muted-foreground font-semibold text-xs uppercase tracking-wide py-3 px-4">
                Jockey
              </Table.Th>
              <Table.Th className="text-muted-foreground font-semibold text-xs uppercase tracking-wide py-3 px-4 text-center">
                Rides
              </Table.Th>
              <Table.Th className="text-muted-foreground font-semibold text-xs uppercase tracking-wide py-3 px-4 text-center">
                Wins
              </Table.Th>
              <Table.Th className="text-muted-foreground font-semibold text-xs uppercase tracking-wide py-3 px-4 text-center">
                Places
              </Table.Th>
              <Table.Th className="text-muted-foreground font-semibold text-xs uppercase tracking-wide py-3 px-4 text-center">
                Win %
              </Table.Th>
              <Table.Th className="text-muted-foreground font-semibold text-xs uppercase tracking-wide py-3 px-4 text-right">
                Prize Money
              </Table.Th>
              <Table.Th className="text-muted-foreground font-semibold text-xs uppercase tracking-wide py-3 px-4 text-center">
                Upcoming
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedJockeys.slice(0, 15).map((stats, index) => (
              <Table.Tr
                key={stats.jockey}
                className={`hover:bg-secondary/20 transition-colors border-b border-border/50 ${
                  stats.isLeading ? "bg-primary/10" : ""
                }`}
              >
                <Table.Td className="py-3 px-4">
                  {index === 0 && stats.wins > 0 ? (
                    <ThemeIcon
                      size="sm"
                      variant="filled"
                      color="yellow"
                      className="bg-yellow-500"
                    >
                      <IconTrophy size={14} />
                    </ThemeIcon>
                  ) : index === 1 && stats.wins > 0 ? (
                    <ThemeIcon
                      size="sm"
                      variant="filled"
                      color="gray"
                      className="bg-gray-400"
                    >
                      <IconMedal size={14} />
                    </ThemeIcon>
                  ) : index === 2 && stats.wins > 0 ? (
                    <ThemeIcon
                      size="sm"
                      variant="filled"
                      color="orange"
                      className="bg-orange-700"
                    >
                      <IconMedal size={14} />
                    </ThemeIcon>
                  ) : (
                    <Text className="text-muted-foreground text-sm text-center">
                      {index + 1}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td className="py-3 px-4">
                  <Group gap="sm">
                    <Avatar src={stats.photo} size="sm" radius="xl" />
                    <div>
                      <Group gap={6}>
                        <Link
                          href={`/jockey/${stats.jockeyId}`}
                          className="hover:underline"
                        >
                          <Text className="text-foreground font-medium">
                            {stats.jockey}
                          </Text>
                        </Link>
                        {getMomentumIcon(stats.momentum)}
                      </Group>
                      {stats.momentum !== "cold" && (
                        <Badge
                          size="xs"
                          color={getMomentumColor(stats.momentum)}
                          variant="light"
                        >
                          {stats.momentum === "hot" ? "On Fire" : "In Form"}
                        </Badge>
                      )}
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td className="py-3 px-4 text-center">
                  <Text className="text-foreground">{stats.rides}</Text>
                </Table.Td>
                <Table.Td className="py-3 px-4 text-center">
                  <Badge
                    size="lg"
                    variant="filled"
                    color={
                      stats.wins >= 2
                        ? "green"
                        : stats.wins === 1
                          ? "teal"
                          : "gray"
                    }
                  >
                    {stats.wins}
                  </Badge>
                </Table.Td>
                <Table.Td className="py-3 px-4 text-center">
                  <Text className="text-muted-foreground">{stats.places}</Text>
                </Table.Td>
                <Table.Td className="py-3 px-4 text-center">
                  <div className="w-20 mx-auto">
                    <Group justify="space-between" mb={2}>
                      <Text size="xs" className="text-foreground font-medium">
                        {stats.winRate.toFixed(0)}%
                      </Text>
                    </Group>
                    <Progress
                      value={stats.winRate}
                      size="sm"
                      color={
                        stats.winRate >= 50
                          ? "green"
                          : stats.winRate >= 25
                            ? "yellow"
                            : "gray"
                      }
                      className="bg-secondary"
                    />
                  </div>
                </Table.Td>
                <Table.Td className="py-3 px-4 text-right">
                  <Text className="text-primary font-semibold">
                    ${(stats.prizeMoney / 1000).toFixed(1)}K
                  </Text>
                </Table.Td>
                <Table.Td className="py-3 px-4 text-center">
                  <Group gap={4} justify="center">
                    {stats.upcomingRides
                      .filter((r) => !completedRaces.includes(r))
                      .slice(0, 5)
                      .map((raceNum) => (
                        <Tooltip key={raceNum} label={`Race ${raceNum}`}>
                          <Badge
                            size="xs"
                            variant="outline"
                            className="border-border text-muted-foreground"
                          >
                            R{raceNum}
                          </Badge>
                        </Tooltip>
                      ))}
                    {stats.upcomingRides.filter(
                      (r) => !completedRaces.includes(r),
                    ).length === 0 && (
                      <Text size="xs" className="text-muted-foreground">
                        Done
                      </Text>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Leader Summary */}
      {sortedJockeys[0]?.wins > 0 && (
        <Paper className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-4">
          <Group gap="sm">
            <IconTrophy size={20} className="text-yellow-400" />
            <Text size="sm" className="text-foreground">
              <strong>{sortedJockeys[0].jockey}</strong> is leading the meeting
              with{" "}
              <strong>
                {sortedJockeys[0].wins} win
                {sortedJockeys[0].wins > 1 ? "s" : ""}
              </strong>
              {sortedJockeys[0].upcomingRides.filter(
                (r) => !completedRaces.includes(r),
              ).length > 0 && (
                <span>
                  {" "}
                  and has{" "}
                  <strong>
                    {
                      sortedJockeys[0].upcomingRides.filter(
                        (r) => !completedRaces.includes(r),
                      ).length
                    }{" "}
                    more ride
                    {sortedJockeys[0].upcomingRides.filter(
                      (r) => !completedRaces.includes(r),
                    ).length > 1
                      ? "s"
                      : ""}
                  </strong>{" "}
                  remaining
                </span>
              )}
            </Text>
          </Group>
        </Paper>
      )}
    </Paper>
  );
}
