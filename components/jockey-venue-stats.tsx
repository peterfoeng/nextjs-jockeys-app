"use client";

import {
  Badge,
  Box,
  Grid,
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
  IconCoin,
  IconMapPin,
  IconTarget,
  IconTrophy,
} from "@tabler/icons-react";
import type { JockeyProfile } from "@/lib/jockey-data";

interface JockeyVenueStatsProps {
  venueStats: JockeyProfile["venueStats"];
  distanceStats: JockeyProfile["distanceStats"];
}

export function JockeyVenueStats({
  venueStats,
  distanceStats,
}: JockeyVenueStatsProps) {
  const maxVenueWinRate = Math.max(...venueStats.map((v) => v.winRate));
  const maxDistanceWinRate = Math.max(...distanceStats.map((d) => d.winRate));

  return (
    <Stack gap="xl">
      {/* Venue Performance */}
      <Paper withBorder radius="xl" p={{ base: "md", md: "xl" }}>
        <Group gap="sm" mb="xl">
          <ThemeIcon
            size="lg"
            radius="md"
            color="blue"
            variant="light"
          >
            <IconMapPin size={20} />
          </ThemeIcon>
          <Box>
            <Title order={4} fw={700}>
              Best Tracks
            </Title>
            <Text size="xs" c="dimmed">
              Win and place rates by venue
            </Text>
          </Box>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {venueStats.map((venue, idx) => {
            const isBest = venue.winRate === maxVenueWinRate;

            return (
              <Paper
                key={venue.venue}
                radius="lg"
                p="md"
                bg={isBest ? "var(--mantine-color-blue-light)" : "var(--mantine-color-default-hover)"}
                withBorder={isBest}
                style={isBest ? { borderColor: "var(--mantine-color-blue-outline)" } : undefined}
              >
                <Group justify="space-between" align="flex-start" mb="sm">
                  <Box>
                    <Group gap="xs">
                      <Text
                        fw={600}
                        c={isBest ? "blue" : undefined}
                      >
                        {venue.venue}
                      </Text>
                      {isBest && (
                        <Badge
                          size="xs"
                          variant="light"
                          color="blue"
                        >
                          Best Track
                        </Badge>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed">
                      {venue.starts} starts
                    </Text>
                  </Box>
                </Group>

                <Grid gutter="md" mb="sm">
                  <Grid.Col span={6}>
                    <Group gap={4} mb={4}>
                      <IconTrophy size={12} color="var(--mantine-color-blue-filled)" />
                      <Text size="xs" c="dimmed">
                        Win Rate
                      </Text>
                    </Group>
                    <Text fw={700} size="lg">
                      {venue.winRate}%
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap={4} mb={4}>
                      <IconTarget size={12} color="var(--mantine-color-cyan-filled)" />
                      <Text size="xs" c="dimmed">
                        Place Rate
                      </Text>
                    </Group>
                    <Text fw={700} size="lg">
                      {venue.placeRate}%
                    </Text>
                  </Grid.Col>
                </Grid>

                <Group gap={4} h={8} style={{ borderRadius: "var(--mantine-radius-xl)", overflow: "hidden", backgroundColor: "var(--mantine-color-default-border)" }} mb="xs">
                  <Tooltip label={`${venue.wins} Wins (${venue.winRate}%)`}>
                    <Box
                      bg="blue"
                      h="100%"
                      style={{ width: `${venue.winRate}%`, transition: "all 0.3s" }}
                    />
                  </Tooltip>
                  <Tooltip
                    label={`Places (${(venue.placeRate - venue.winRate).toFixed(1)}%)`}
                  >
                    <Box
                      bg="cyan"
                      h="100%"
                      style={{ width: `${venue.placeRate - venue.winRate}%`, transition: "all 0.3s" }}
                    />
                  </Tooltip>
                </Group>

                <Group justify="space-between">
                  <Group gap={4}>
                    <IconCoin size={12} color="var(--mantine-color-dimmed)" />
                    <Text size="xs" c="dimmed">
                      Avg Prize
                    </Text>
                  </Group>
                  <Text size="xs" fw={500}>
                    {venue.avgPrizeMoney}
                  </Text>
                </Group>
              </Paper>
            );
          })}
        </SimpleGrid>
      </Paper>

      {/* Distance Performance */}
      <Paper withBorder radius="xl" p={{ base: "md", md: "xl" }}>
        <Group gap="sm" mb="xl">
          <ThemeIcon size="lg" radius="md" color="cyan" variant="light">
            <IconTarget size={20} />
          </ThemeIcon>
          <Box>
            <Title order={4} fw={700}>
              Distance Breakdown
            </Title>
            <Text size="xs" c="dimmed">
              Performance by race distance
            </Text>
          </Box>
        </Group>

        <Stack gap="md">
          {distanceStats.map((distance) => {
            const isBest = distance.winRate === maxDistanceWinRate;

            return (
              <Box key={distance.distance}>
                <Group justify="space-between" mb="xs">
                  <Group gap="sm">
                    <Text
                      fw={500}
                      c={isBest ? "blue" : undefined}
                    >
                      {distance.distance}
                    </Text>
                    {isBest && (
                      <Badge
                        size="xs"
                        variant="light"
                        color="blue"
                      >
                        Best Distance
                      </Badge>
                    )}
                  </Group>
                  <Group gap="md">
                    <Text size="xs" c="dimmed">
                      {distance.wins}W / {distance.starts} starts
                    </Text>
                    <Badge
                      variant={isBest ? "filled" : "light"}
                      color={isBest ? "blue" : "gray"}
                    >
                      {distance.winRate}%
                </Box>
                <Progress
                  value={(distance.winRate / maxDistanceWinRate) * 100}
                  size="md"
                  radius="xl"
                  color={isBest ? "blue" : "gray"}
                />
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Stack>
  );
}
