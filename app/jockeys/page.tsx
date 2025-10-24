import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { Metadata } from "next";
import Link from "next/link";

import {
  formatAsPercent,
  formatDateKey,
  getAllJockeys,
  getCurrentDateKey,
} from "@/lib/jockeys";

export const metadata: Metadata = {
  title: "Jockeys riding today",
  description: "Directory of jockeys with bookings scheduled for today.",
};

export default async function JockeysIndexPage() {
  const todayKey = getCurrentDateKey();
  const todayLabel = formatDateKey(todayKey, { dateStyle: "full" });
  const jockeys = await getAllJockeys();

  const ridingToday = jockeys
    .map((profile) => ({
      profile,
      todaysRides: profile.stats.filter((race) => race.raceDate === todayKey),
    }))
    .filter((entry) => entry.todaysRides.length > 0)
    .sort((a, b) => a.profile.name.localeCompare(b.profile.name));

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={1}>Jockeys riding today</Title>
          <Text c="dimmed">Bookings for {todayLabel}</Text>
        </Stack>

        {ridingToday.length === 0 ? (
          <Paper radius="md" p="xl" withBorder>
            <Stack gap="sm">
              <Title order={3}>No rides available</Title>
              <Text c="dimmed" size="sm">
                We couldn&apos;t find any jockey bookings for today. Check back
                tomorrow once new fields have been finalised.
              </Text>
            </Stack>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {ridingToday.map(({ profile, todaysRides }) => {
              const winRate = profile.derived?.winRate ?? 0;
              const placeRate = profile.derived?.placeRate ?? 0;

              return (
                <Card
                  key={profile.slug}
                  withBorder
                  radius="md"
                  shadow="sm"
                  padding="lg"
                >
                  <Stack gap="md">
                    <Stack gap={4}>
                      <Group justify="space-between">
                        <Text fw={600} size="lg">
                          {profile.name}
                        </Text>
                        <Badge color="blue" variant="light">
                          {todaysRides.length}{" "}
                          {todaysRides.length === 1 ? "ride" : "rides"}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {profile.location || "Location TBC"}
                      </Text>
                    </Stack>

                    <Stack gap={4}>
                      <Text size="sm" fw={500}>
                        Form snapshot
                      </Text>
                      <Group gap="sm">
                        <Badge color="green" variant="light">
                          Win {formatAsPercent(winRate)}
                        </Badge>
                        <Badge color="grape" variant="light">
                          Place {formatAsPercent(placeRate)}
                        </Badge>
                      </Group>
                    </Stack>

                    <Button
                      component={Link}
                      href={`/jockeys/${profile.slug}`}
                      variant="light"
                      color="blue"
                    >
                      View profile
                    </Button>
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
