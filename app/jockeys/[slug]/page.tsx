import {
  Badge,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  formatAsPercent,
  formatDateKey,
  getAllJockeySlugs,
  getCurrentDateKey,
  getJockeyBySlug,
  type JockeyRace,
  type JockeyStreak,
} from "@/lib/jockeys";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await getAllJockeySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const profile = await getJockeyBySlug(params.slug);

  if (!profile) {
    return {
      title: "Jockey not found",
      description: "We could not find the requested jockey profile.",
    };
  }

  return {
    title: `${profile.name} | Jockey profile`,
    description: `Form guide, recent rides, and today's bookings for ${profile.name}.`,
  };
}

export default async function JockeyProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const profile = await getJockeyBySlug(params.slug);

  if (!profile) {
    notFound();
  }

  const todayKey = getCurrentDateKey();
  const todayLabel = formatDateKey(todayKey, { dateStyle: "full" });

  const todaysRides = profile.stats
    .filter((race) => race.raceDate === todayKey)
    .slice()
    .sort((a, b) => (a.raceNumber ?? 0) - (b.raceNumber ?? 0));

  const previousRides = profile.stats
    .filter((race) => race.raceDate < todayKey)
    .slice()
    .sort((a, b) => {
      if (a.raceDate === b.raceDate) {
        return (b.raceNumber ?? 0) - (a.raceNumber ?? 0);
      }

      return a.raceDate < b.raceDate ? 1 : -1;
    });

  const derived = profile.derived;

  const statCards: Array<{ label: string; value: string }> = [
    {
      label: "Total rides",
      value: String(derived?.totalRides ?? profile.stats.length),
    },
    {
      label: "Wins",
      value: String(derived?.totalWins ?? 0),
    },
    {
      label: "Win rate",
      value: derived ? formatAsPercent(derived.winRate) : "—",
    },
    {
      label: "Places",
      value: String(derived?.totalPlaces ?? 0),
    },
    {
      label: "Place rate",
      value: derived ? formatAsPercent(derived.placeRate) : "—",
    },
    {
      label: "Days since last win",
      value:
        derived?.daysSinceLastWin === null
          ? "—"
          : derived?.daysSinceLastWin === 0
            ? "Today"
            : `${derived?.daysSinceLastWin} days`,
    },
    {
      label: "Recent form",
      value: derived?.recentForm ?? "—",
    },
    {
      label: "Current streak",
      value: derived?.currentStreak ? formatStreak(derived.currentStreak) : "—",
    },
  ];

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stack gap="sm">
          <Stack gap={4}>
            <Title order={1}>{profile.name}</Title>
            <Group gap="sm">
              <Badge color={profile.isFemale ? "pink" : "blue"} variant="light">
                {profile.isFemale ? "Female" : "Male"}
              </Badge>
              {profile.rank ? (
                <Badge variant="outline" color="gray">
                  Rank: {profile.rank}
                </Badge>
              ) : null}
              {profile.age ? (
                <Badge variant="outline" color="gray">
                  Age: {profile.age}
                </Badge>
              ) : null}
            </Group>
          </Stack>
          <Text c="dimmed">
            {profile.location || "Location to be confirmed"}
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          {statCards.map((stat) => (
            <Paper key={stat.label} withBorder radius="md" p="md">
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  {stat.label}
                </Text>
                <Text fw={600} size="xl">
                  {stat.value}
                </Text>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>

        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={2}>Today&apos;s rides</Title>
            <Text c="dimmed" size="sm">
              Bookings for {todayLabel}
            </Text>
          </Stack>
          <Paper withBorder radius="md" p="md">
            {todaysRides.length === 0 ? (
              <Text size="sm" c="dimmed">
                No confirmed rides for today.
              </Text>
            ) : (
              <RidesTable rides={todaysRides} />
            )}
          </Paper>

          <Stack gap={4}>
            <Title order={2}>Previous rides</Title>
            <Text c="dimmed" size="sm">
              {previousRides.length > 0
                ? `Last ${previousRides.length} recorded start${previousRides.length === 1 ? "" : "s"}`
                : "No historical rides captured yet"}
            </Text>
          </Stack>
          <Paper withBorder radius="md" p="md">
            {previousRides.length === 0 ? (
              <Text size="sm" c="dimmed">
                No historical rides available yet.
              </Text>
            ) : (
              <RidesTable rides={previousRides} />
            )}
          </Paper>
        </Stack>
      </Stack>
    </Container>
  );
}

function RidesTable({ rides }: { rides: JockeyRace[] }) {
  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Race</Table.Th>
          <Table.Th>Venue</Table.Th>
          <Table.Th>Horse</Table.Th>
          <Table.Th>Trainer</Table.Th>
          <Table.Th>Odds</Table.Th>
          <Table.Th>Barrier</Table.Th>
          <Table.Th>Result</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rides.map((ride) => (
          <Table.Tr
            key={`${ride.raceDate}-${ride.raceNumber ?? 0}-${ride.horse}`}
          >
            <Table.Td>
              <Stack gap={2}>
                <Text fw={500}>{ride.raceTitle}</Text>
                <Text size="xs" c="dimmed">
                  {formatDateKey(ride.raceDate, { dateStyle: "medium" })}
                  {ride.raceNumber ? ` · Race ${ride.raceNumber}` : ""}
                  {ride.distance ? ` · ${ride.distance}m` : ""}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>{ride.raceVenue}</Table.Td>
            <Table.Td>{ride.horse}</Table.Td>
            <Table.Td>{ride.trainerName ?? "—"}</Table.Td>
            <Table.Td>
              {ride.spString ?? formatStartingPrice(ride.spValue)}
            </Table.Td>
            <Table.Td>{ride.barrier ?? "—"}</Table.Td>
            <Table.Td>{formatPosition(ride.finishingPosition)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

function formatPosition(position: number | null): string {
  if (position === null) {
    return "—";
  }

  const mod100 = position % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return `${position}th`;
  }

  const mod10 = position % 10;
  switch (mod10) {
    case 1:
      return `${position}st`;
    case 2:
      return `${position}nd`;
    case 3:
      return `${position}rd`;
    default:
      return `${position}th`;
  }
}

function formatStartingPrice(value: number | null): string {
  if (value === null) {
    return "—";
  }

  const formatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

function formatStreak(streak: JockeyStreak): string {
  const prefix =
    streak.type === "winning"
      ? "Winning streak"
      : streak.type === "losing"
        ? "Losing streak"
        : streak.type === "neutral"
          ? "Neutral streak"
          : "Streak";

  return streak.count > 0 ? `${prefix} (${streak.count})` : prefix;
}
