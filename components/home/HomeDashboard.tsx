"use client";

import {
  Anchor,
  Badge,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import type { DashboardSummary } from "@/lib/raceData";
import { formatIsoDate } from "@/lib/raceData";

interface HomeDashboardProps {
  summary: DashboardSummary | null;
}

const statsConfig: {
  label: string;
  getValue: (summary: DashboardSummary) => number;
}[] = [
  { label: "Venues", getValue: (summary) => summary.totalVenues },
  { label: "Races", getValue: (summary) => summary.totalRaces },
  { label: "Starters", getValue: (summary) => summary.totalRunners },
  { label: "Jockeys", getValue: (summary) => summary.uniqueJockeys },
];

export default function HomeDashboard({ summary }: HomeDashboardProps) {
  if (!summary) {
    return (
      <Stack gap="md" py="xl">
        <Title order={2}>No race data available</Title>
        <Text c="dimmed">
          Add race JSON files to the data directory to populate the dashboard.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" py="xl">
      <Stack gap={4}>
        <Title order={1}>Races on {formatIsoDate(summary.date)}</Title>
        <Text c="dimmed">
          {summary.totalVenues} venues · {summary.totalRaces} races ·{" "}
          {summary.uniqueJockeys} jockeys engaged
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {statsConfig.map((stat) => (
          <Paper key={stat.label} p="md" radius="md" shadow="sm" withBorder>
            <Stack gap={4}>
              <Text c="dimmed" fw={500} size="sm">
                {stat.label}
              </Text>
              <Title order={2}>{stat.getValue(summary)}</Title>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      <Stack gap="xs">
        <Title order={3}>Meetings by venue</Title>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Venue</Table.Th>
              <Table.Th ta="right">Races</Table.Th>
              <Table.Th ta="right">Runners</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {summary.venues.map((venue) => (
              <Table.Tr key={venue.slug}>
                <Table.Td>
                  <Stack gap={2}>
                    <Anchor
                      component={Link}
                      href={`/races/${summary.date}/${venue.slug}`}
                      fw={600}
                    >
                      {venue.name}
                    </Anchor>
                    <Badge variant="light" size="sm" maw={200}>
                      {venue.slug}
                    </Badge>
                  </Stack>
                </Table.Td>
                <Table.Td ta="right">{venue.raceCount}</Table.Td>
                <Table.Td ta="right">{venue.runnerCount}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Stack>
  );
}
