"use client";

import {
  Anchor,
  Badge,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import type { RaceVenueData } from "@/lib/raceData";
import { formatIsoDate } from "@/lib/raceData";

interface RaceVenueViewProps {
  date: string;
  data: RaceVenueData;
}

export default function RaceVenueView({ date, data }: RaceVenueViewProps) {
  const meeting = data.venueInfo;

  return (
    <Stack gap="xl" py="xl">
      <Stack gap={4}>
        <Title order={1}>{meeting.name}</Title>
        <Group gap="xs">
          <Badge variant="light">{formatIsoDate(date)}</Badge>
          {meeting.clubName ? (
            <Badge variant="light">{meeting.clubName}</Badge>
          ) : null}
          {meeting.location ? (
            <Badge variant="light">{meeting.location}</Badge>
          ) : null}
        </Group>
        {meeting.sourceUrl ? (
          <Anchor
            href={meeting.sourceUrl}
            target="_blank"
            rel="noreferrer"
            size="sm"
          >
            View official fields
          </Anchor>
        ) : null}
      </Stack>

      <Stack gap="lg">
        {data.races.map((race, index) => (
          <Paper key={race.title} withBorder shadow="sm" p="lg" radius="md">
            <Stack gap="md">
              <Stack gap={4}>
                <Group justify="space-between" align="flex-end">
                  <Title order={3}>
                    Race {index + 1}: {race.title}
                  </Title>
                  <Badge variant="filled" color="blue">
                    {race.distance}m
                  </Badge>
                </Group>
                <Text c="dimmed" size="sm">
                  {race.grade}
                </Text>
                <Group gap="xs">
                  {race.trackType ? (
                    <Badge variant="light">{race.trackType}</Badge>
                  ) : null}
                  {race.trackCondition ? (
                    <Badge variant="light">{race.trackCondition}</Badge>
                  ) : null}
                  <Badge variant="light">Field {race.runners.length}</Badge>
                  <Badge variant="light">Scratched {race.scratched}</Badge>
                </Group>
              </Stack>

              <Table striped withColumnBorders highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Horse</Table.Th>
                    <Table.Th>Jockey</Table.Th>
                    <Table.Th ta="right">Barrier</Table.Th>
                    <Table.Th ta="right">Weight</Table.Th>
                    <Table.Th ta="right">Claim</Table.Th>
                    <Table.Th>Trainer</Table.Th>
                    <Table.Th ta="right">SP</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {race.runners.map((runner) => (
                    <Table.Tr key={`${runner.horse}-${runner.barrier}`}>
                      <Table.Td fw={600}>{runner.horse}</Table.Td>
                      <Table.Td>{runner.jockey}</Table.Td>
                      <Table.Td ta="right">{runner.barrier}</Table.Td>
                      <Table.Td ta="right">{runner.weight}</Table.Td>
                      <Table.Td ta="right">
                        {runner.claimedWeight ?? "-"}
                      </Table.Td>
                      <Table.Td>{runner.trainer}</Table.Td>
                      <Table.Td ta="right">
                        {runner.sp ? `$${runner.sp.toFixed(2)}` : "-"}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
