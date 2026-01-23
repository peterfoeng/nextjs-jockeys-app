"use client";

import {
  Badge,
  Box,
  Group,
  Paper,
  ScrollArea,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCoin,
  IconMapPin,
  IconRuler,
  IconTrophy,
} from "@tabler/icons-react";
import type { JockeyProfile } from "@/lib/jockey-data";

interface JockeyRecentWinsProps {
  wins: JockeyProfile["recentWins"];
}

export function JockeyRecentWins({ wins }: JockeyRecentWinsProps) {
  return (
    <Paper withBorder radius="xl" p={{ base: "md", md: "xl" }}>
      <Group gap="sm" mb="xl">
        <ThemeIcon size="lg" radius="md" color="blue" variant="light">
          <IconTrophy size={20} />
        </ThemeIcon>
        <Box>
          <Title order={4} fw={700}>
            Recent Wins
          </Title>
          <Text size="xs" c="dimmed">
            Latest victories and race details
          </Text>
        </Box>
      </Group>

      <ScrollArea>
        <Table miw={700}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th c="dimmed" fw={500}>
                Date
              </Table.Th>
              <Table.Th c="dimmed" fw={500}>
                Venue
              </Table.Th>
              <Table.Th c="dimmed" fw={500}>
                Horse
              </Table.Th>
              <Table.Th c="dimmed" fw={500}>
                Race
              </Table.Th>
              <Table.Th c="dimmed" fw={500}>
                Distance
              </Table.Th>
              <Table.Th c="dimmed" fw={500}>
                Margin
              </Table.Th>
              <Table.Th c="dimmed" fw={500}>
                Prize
              </Table.Th>
              <Table.Th c="dimmed" fw={500}>
                Odds
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {wins.map((win, idx) => (
              <Table.Tr key={idx}>
                <Table.Td fw={500}>{win.date}</Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <IconMapPin
                      size={14}
                      color="var(--mantine-color-cyan-filled)"
                    />
                    <Text size="sm">{win.venue}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text c="blue" fw={600}>
                    {win.horse}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {win.race}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <IconRuler size={14} color="var(--mantine-color-dimmed)" />
                    <Text size="sm">{win.distance}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="blue">
                    {win.margin}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <IconCoin
                      size={14}
                      color="var(--mantine-color-cyan-filled)"
                    />
                    <Text size="sm" fw={500}>
                      {win.prize}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge variant="outline" c="dimmed">
                    {win.odds}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
