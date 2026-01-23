"use client";

import {
  Badge,
  Box,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconFlame,
  IconHorse,
  IconSnowflake,
  IconTrendingDown,
} from "@tabler/icons-react";
import Link from "next/link";
import { getJockeyIdFromShortName, jockeyProfiles } from "@/lib/jockey-data";
import type { Race } from "@/lib/race-data";

interface ColdJockeyAlertProps {
  races: Race[];
}

interface ColdJockeyOnFavorite {
  jockey: string;
  jockeyId: string;
  horse: string;
  raceNumber: number;
  odds: number;
  favoritePosition: number;
  daysSinceLastWin: number;
  lastWinVenue: string;
  lastWinDate: string;
  strikeRate: number;
  recentLosses: number;
  riskLevel: "high" | "medium" | "low";
}

export function ColdJockeyAlert({ races }: ColdJockeyAlertProps) {
  const coldJockeysOnFavorites: ColdJockeyOnFavorite[] = [];

  races.forEach((race) => {
    const sortedByOdds = [...race.participants].sort((a, b) => {
      const oddsA = Number.parseFloat(a.odds.replace("$", ""));
      const oddsB = Number.parseFloat(b.odds.replace("$", ""));
      return oddsA - oddsB;
    });

    const topThreeFavorites = sortedByOdds.slice(0, 3);

    topThreeFavorites.forEach((participant, index) => {
      const jockeyId = getJockeyIdFromShortName(participant.jockey);
      const jockeyProfile = jockeyId ? jockeyProfiles[jockeyId] : null;

      if (jockeyProfile && jockeyProfile.daysSinceLastWin >= 7) {
        let riskLevel: "high" | "medium" | "low" = "low";
        if (
          jockeyProfile.daysSinceLastWin >= 14 ||
          jockeyProfile.strikeRate < 15
        ) {
          riskLevel = "high";
        } else if (
          jockeyProfile.daysSinceLastWin >= 10 ||
          jockeyProfile.strikeRate < 20
        ) {
          riskLevel = "medium";
        }

        const recentLosses =
          jockeyProfile.recentForm.total -
          jockeyProfile.recentForm.wins -
          jockeyProfile.recentForm.places;

        coldJockeysOnFavorites.push({
          jockey: participant.jockey,
          jockeyId: jockeyId || "",
          horse: participant.horseName,
          raceNumber: race.raceNumber,
          odds: Number.parseFloat(participant.odds.replace("$", "")),
          favoritePosition: index + 1,
          daysSinceLastWin: jockeyProfile.daysSinceLastWin,
          lastWinVenue: jockeyProfile.lastWinVenue,
          lastWinDate: jockeyProfile.lastWinDate,
          strikeRate: jockeyProfile.strikeRate,
          recentLosses,
          riskLevel,
        });
      }
    });
  });

  if (coldJockeysOnFavorites.length === 0) {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "red";
      case "medium":
        return "yellow";
      default:
        return "blue";
    }
  };

  const getFavoriteLabel = (position: number) => {
    switch (position) {
      case 1:
        return "Favourite";
      case 2:
        return "2nd Fav";
      case 3:
        return "3rd Fav";
      default:
        return `${position}th Fav`;
    }
  };

  return (
    <Paper withBorder radius="xl" p="xl" mb="xl">
      <Group gap="sm" mb="lg">
        <ThemeIcon size="lg" variant="light" color="orange">
          <IconSnowflake size={20} />
        </ThemeIcon>
        <Box>
          <Title order={4} fw={700}>
            Cold Jockey Alert
          </Title>
          <Text size="sm" c="dimmed">
            Jockeys without recent wins riding market favorites - proceed with
            caution
          </Text>
        </Box>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {coldJockeysOnFavorites.map((item, index) => (
          <Paper
            key={`${item.jockey}-${item.raceNumber}-${index}`}
            withBorder
            radius="md"
            p="md"
            style={{
              background: "var(--mantine-color-default-hover)",
              transition: "border-color 0.2s",
            }}
          >
            <Group justify="space-between" mb="sm">
              <Badge
                color={getRiskColor(item.riskLevel)}
                variant="light"
                size="sm"
              >
                {item.riskLevel.toUpperCase()} RISK
              </Badge>
              <Badge variant="outline" size="sm" color="blue">
                R{item.raceNumber}
              </Badge>
            </Group>

            <Group gap="xs" mb="xs">
              <Link
                href={`/jockey/${item.jockeyId}`}
                style={{ textDecoration: "none" }}
              >
                <Text
                  fw={700}
                  style={{ cursor: "pointer" }}
                  c="var(--mantine-color-text)"
                >
                  {item.jockey}
                </Text>
              </Link>
              <Badge color="orange" variant="filled" size="xs">
                {getFavoriteLabel(item.favoritePosition)}
              </Badge>
            </Group>

            <Group gap="xs" mb="md">
              <IconHorse size={14} color="var(--mantine-color-dimmed)" />
              <Text size="sm" c="dimmed">
                {item.horse}
              </Text>
              <Text size="sm" c="blue" fw={600}>
                ${item.odds.toFixed(2)}
              </Text>
            </Group>

            <Stack gap="xs">
              <Group justify="space-between">
                <Group gap="xs">
                  <IconTrendingDown
                    size={14}
                    color="var(--mantine-color-red-6)"
                  />
                  <Text size="xs" c="dimmed">
                    Days since win
                  </Text>
                </Group>
                <Text size="xs" c="red" fw={700}>
                  {item.daysSinceLastWin} days
                </Text>
              </Group>

              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  Last win
                </Text>
                <Text size="xs">
                  {item.lastWinVenue} ({item.lastWinDate})
                </Text>
              </Group>

              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">
                    Strike Rate
                  </Text>
                  <Text size="xs" fw={500}>
                    {item.strikeRate}%
                  </Text>
                </Group>
                <Progress
                  value={item.strikeRate}
                  size="sm"
                  color={
                    item.strikeRate < 15
                      ? "red"
                      : item.strikeRate < 20
                        ? "yellow"
                        : "green"
                  }
                />
              </Box>
            </Stack>

            <Tooltip label="This jockey is on a cold streak but riding a market favorite. Consider the risk before backing.">
              <Group gap={4} mt="md" c="orange">
                <IconAlertTriangle size={14} />
                <Text size="xs">Value risk detected</Text>
              </Group>
            </Tooltip>
          </Paper>
        ))}
      </SimpleGrid>

      {coldJockeysOnFavorites.length > 0 && (
        <Paper
          withBorder
          radius="md"
          p="md"
          mt="md"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--mantine-color-orange-6) 10%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--mantine-color-orange-6) 30%, transparent)",
          }}
        >
          <Group gap="sm">
            <IconFlame size={18} color="var(--mantine-color-orange-6)" />
            <Text size="sm" c="orange.2">
              <Text component="span" fw={700}>
                Pro Tip:
              </Text>{" "}
              Cold jockeys on favorites can represent value opportunities for
              opposing runners, or potential bounce-back wins. Check their
              trainer partnerships and track record at this venue.
            </Text>
          </Group>
        </Paper>
      )}
    </Paper>
  );
}
