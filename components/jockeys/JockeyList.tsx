"use client";

import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { JockeySummary } from "@/lib/raceData";
import { formatIsoDate } from "@/lib/raceData";

interface JockeyListProps {
  date: string | null;
  summaries: JockeySummary[];
}

export default function JockeyList({ date, summaries }: JockeyListProps) {
  if (!date) {
    return (
      <Stack gap="md" py="xl">
        <Title order={2}>No jockey data available</Title>
        <Text c="dimmed">Add race meetings to see participating jockeys.</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" py="xl">
      <Stack gap={4}>
        <Title order={1}>Jockey engagements for {formatIsoDate(date)}</Title>
        <Text c="dimmed">{summaries.length} jockeys with confirmed rides</Text>
      </Stack>

      {summaries.length === 0 ? (
        <Text>No jockeys have been recorded for this date.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {summaries.map((jockey) => (
            <Card
              key={jockey.slug || jockey.name}
              withBorder
              radius="md"
              shadow="sm"
              p="lg"
            >
              <Stack gap="xs">
                <Group justify="space-between" align="flex-start">
                  <Stack gap={2}>
                    <Title order={4}>{jockey.name}</Title>
                    <Group gap="xs">
                      <Badge color="blue" variant="filled">
                        {jockey.ridesToday} rides
                      </Badge>
                      {jockey.profile?.derived?.totalWins ? (
                        <Badge color="green" variant="light">
                          {jockey.profile.derived.totalWins} wins season
                        </Badge>
                      ) : null}
                    </Group>
                  </Stack>
                  {jockey.profile?.derived?.recentForm ? (
                    <Badge variant="outline" color="gray">
                      Form {jockey.profile.derived.recentForm}
                    </Badge>
                  ) : null}
                </Group>

                <Stack gap={4}>
                  <Text fw={500} size="sm">
                    Venues today
                  </Text>
                  <Group gap="xs">
                    {jockey.venues.map((venue) => (
                      <Badge key={venue} variant="light" color="gray">
                        {venue}
                      </Badge>
                    ))}
                  </Group>
                </Stack>

                {jockey.profile?.derived ? (
                  <Stack gap={2}>
                    <Text size="sm" c="dimmed">
                      Lifetime rides: {jockey.profile.derived.totalRides} · Win
                      rate: {Math.round(jockey.profile.derived.winRate * 100)}%
                    </Text>
                    {jockey.profile.derived.currentStreak ? (
                      <Text size="sm" c="dimmed">
                        Current streak:{" "}
                        {jockey.profile.derived.currentStreak.count}{" "}
                        {jockey.profile.derived.currentStreak.type}
                      </Text>
                    ) : null}
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    No additional profile data available.
                  </Text>
                )}
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
