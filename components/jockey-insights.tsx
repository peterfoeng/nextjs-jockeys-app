"use client";

import {
  Badge,
  Box,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendar,
  IconFlame,
  IconHorseToy,
  IconMapPin,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { getJockeyIdFromShortName } from "@/lib/jockey-data";
import type { JockeyStats, Participant } from "@/lib/race-data";
import { jockeyStats } from "@/lib/race-data";
import classes from "./jockey-insights.module.css";

interface JockeyInsightsProps {
  participants: Participant[];
}

function getFormBadgeColor(strikeRate: number) {
  if (strikeRate >= 25) return "blue";
  if (strikeRate >= 20) return "cyan";
  if (strikeRate >= 15) return "gray";
  return "gray";
}

function getHotStreakIndicator(daysSinceWin: number) {
  if (daysSinceWin <= 1)
    return { label: "Hot", color: "blue", icon: IconFlame };
  if (daysSinceWin <= 4)
    return { label: "Warm", color: "cyan", icon: IconTrendingUp };
  return null;
}

export function JockeyInsights({ participants }: JockeyInsightsProps) {
  // Get unique jockeys from participants
  const uniqueJockeys = [...new Set(participants.map((p) => p.jockey))];
  const jockeyData = uniqueJockeys
    .map((jockey) => ({ shortName: jockey, stats: jockeyStats[jockey] }))
    .filter(
      (data): data is { shortName: string; stats: JockeyStats } =>
        data.stats !== undefined,
    );

  if (jockeyData.length === 0) return null;

  return (
    <Paper
      withBorder
      radius="xl"
      p="md"
      mt="md"
      style={{
        background:
          "color-mix(in srgb, var(--mantine-color-body) 50%, transparent)",
      }}
    >
      <Group gap="sm" mb="lg">
        <ThemeIcon size="lg" radius="md" color="blue" variant="light">
          <IconUsers size={20} />
        </ThemeIcon>
        <div>
          <Title order={5} fw={700}>
            Jockey Insights
          </Title>
          <Text size="xs" c="dimmed">
            Recent form and key statistics for riders in this race
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {jockeyData.map(({ shortName, stats }) => {
          const hotStreak = getHotStreakIndicator(stats.daysSinceLastWin);
          const winRate = (
            (stats.recentForm.wins / stats.recentForm.total) *
            100
          ).toFixed(0);
          const placeRate = (
            ((stats.recentForm.wins + stats.recentForm.places) /
              stats.recentForm.total) *
            100
          ).toFixed(0);
          const jockeyId = getJockeyIdFromShortName(shortName);

          const CardContent = (
            <Paper
              className={
                jockeyId ? classes.insightCard : classes.insightCardNonClickable
              }
            >
              {/* Jockey Header */}
              <Flex className={classes.headerContainer}>
                <div>
                  <Group gap="xs">
                    <Text
                      fw={600}
                      c={jockeyId ? "blue" : undefined}
                      style={jockeyId ? { cursor: "pointer" } : undefined}
                    >
                      {stats.name}
                    </Text>
                    {hotStreak && (
                      <Tooltip
                        label={`Won ${stats.daysSinceLastWin === 0 ? "today" : stats.daysSinceLastWin + " day(s) ago"}`}
                      >
                        <Badge
                          size="xs"
                          variant="light"
                          color={hotStreak.color}
                          leftSection={<hotStreak.icon size={10} />}
                        >
                          {hotStreak.label}
                        </Badge>
                      </Tooltip>
                    )}
                  </Group>
                  <Text size="xs" c="dimmed">
                    Season: {stats.seasonWins}W / {stats.seasonStarts} starts
                  </Text>
                </div>
                <Badge size="lg" color={getFormBadgeColor(stats.strikeRate)}>
                  {stats.strikeRate}%
                </Badge>
              </Flex>

              {/* Recent Form Bar */}
              <Box mb="sm">
                <Flex justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">
                    Last {stats.recentForm.total} rides
                  </Text>
                  <Text size="xs" fw={500}>
                    {stats.recentForm.wins}W - {stats.recentForm.places}P
                  </Text>
                </Flex>
                <Box className={classes.formBarContainer}>
                  <Tooltip
                    label={`${stats.recentForm.wins} Wins (${winRate}%)`}
                  >
                    <Box
                      className={classes.formBarWin}
                      style={{ width: `${winRate}%` }}
                    />
                  </Tooltip>
                  <Tooltip label={`${stats.recentForm.places} Places`}>
                    <Box
                      className={classes.formBarPlace}
                      style={{
                        width: `${Number(placeRate) - Number(winRate)}%`,
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>

              {/* Last Win Info */}
              <Box className={classes.lastWinSection}>
                <Text
                  size="xs"
                  c="dimmed"
                  mb={6}
                  fw={500}
                  tt="uppercase"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Last Win
                </Text>
                <Box className={classes.trainerGrid}>
                  <Group gap={4}>
                    <IconCalendar
                      size={12}
                      color="var(--mantine-color-blue-6)"
                    />
                    <Text size="xs">
                      {stats.daysSinceLastWin === 0
                        ? "Today"
                        : stats.daysSinceLastWin === 1
                          ? "Yesterday"
                          : `${stats.daysSinceLastWin}d ago`}
                    </Text>
                  </Group>
                  <Group gap={4}>
                    <IconMapPin size={12} color="var(--mantine-color-cyan-6)" />
                    <Text size="xs">{stats.lastWinVenue}</Text>
                  </Group>
                  <Group gap={4} className={classes.twoColSpan}>
                    <IconHorseToy
                      size={12}
                      color="var(--mantine-color-dimmed)"
                    />
                    <Text size="xs" c="dimmed">
                      {stats.lastWinHorse}
                    </Text>
                  </Group>
                </Box>
              </Box>

              {/* Top Trainer Partnerships */}
              <div>
                <Text
                  size="xs"
                  c="dimmed"
                  mb={6}
                  fw={500}
                  tt="uppercase"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Top Trainer Combos
                </Text>
                <Stack gap={6}>
                  {stats.trainerPartnerships.slice(0, 2).map((partnership) => {
                    const partnershipWinRate = (
                      (partnership.wins / partnership.starts) *
                      100
                    ).toFixed(0);
                    return (
                      <Flex
                        key={partnership.trainer}
                        className={classes.trainerRow}
                      >
                        <Text size="xs">{partnership.trainer}</Text>
                        <Group gap="xs">
                          <Text size="xs" c="dimmed">
                            {partnership.wins}W/{partnership.starts}
                          </Text>
                          <Badge size="xs" variant="outline" color="gray">
                            {partnershipWinRate}%
                          </Badge>
                        </Group>
                      </Flex>
                    );
                  })}
                </Stack>
              </div>
            </Paper>
          );

          if (jockeyId) {
            return (
              <Link
                key={stats.name}
                href={`/jockey/${jockeyId}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                {CardContent}
              </Link>
            );
          }

          return <div key={stats.name}>{CardContent}</div>;
        })}
      </SimpleGrid>
    </Paper>
  );
}
