"use client";

import {
  Badge,
  Box,
  Group,
  Paper,
  ScrollArea,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconClock, IconRuler, IconTrophy } from "@tabler/icons-react";
import type { Race } from "@/lib/race-data";
import { JockeyInsights } from "./jockey-insights";

interface RaceCardProps {
  race: Race;
  isExpanded?: boolean;
}

export function RaceCard({ race, isExpanded = false }: RaceCardProps) {
  return (
    <Paper withBorder radius="xl" style={{ overflow: "hidden" }}>
      {/* Race Header */}
      <Box
        bg="var(--mantine-color-default-hover)"
        px={{ base: "md", md: "xl" }}
        py="md"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Group gap="md">
            <Box
              w={48}
              h={48}
              style={{
                borderRadius: "var(--mantine-radius-xl)",
                backgroundColor: "var(--mantine-color-blue-filled)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Text c="white" fw={700} size="lg">
                R{race.raceNumber}
              </Text>
            </Box>
            <div>
              <Title order={4} fw={700}>
                {race.raceName}
              </Title>
              <Group gap="sm" mt={4}>
                <Badge variant="outline" size="sm" c="dimmed">
                  {race.raceType}
                </Badge>
              </Group>
            </div>
          </Group>

          <Group gap="md" wrap="wrap">
            <Group gap="xs">
              <IconClock size={16} color="var(--mantine-color-cyan-filled)" />
              <Text size="sm" fw={500}>
                {race.time}
              </Text>
            </Group>
            <Group gap="xs">
              <IconRuler size={16} color="var(--mantine-color-blue-filled)" />
              <Text size="sm" fw={500}>
                {race.distance}
              </Text>
            </Group>
            <Group gap="xs">
              <IconTrophy size={16} color="var(--mantine-color-cyan-filled)" />
              <Text size="sm" fw={500}>
                {race.prize}
              </Text>
            </Group>
          </Group>
        </Group>
      </Box>

      {/* Participants Table */}
      <ScrollArea>
        <Table striped highlightOnHover miw={800}>
          <Table.Thead>
            <Table.Tr bg="var(--mantine-color-default-hover)">
              <Table.Th
                c="dimmed"
                fw={600}
                tt="uppercase"
                fz="xs"
                style={{ letterSpacing: "0.05em", padding: "12px 16px" }}
              >
                #
              </Table.Th>
              <Table.Th
                c="dimmed"
                fw={600}
                tt="uppercase"
                fz="xs"
                style={{ letterSpacing: "0.05em", padding: "12px 16px" }}
              >
                Horse
              </Table.Th>
              <Table.Th
                c="dimmed"
                fw={600}
                tt="uppercase"
                fz="xs"
                style={{ letterSpacing: "0.05em", padding: "12px 16px" }}
              >
                Jockey
              </Table.Th>
              <Table.Th
                c="dimmed"
                fw={600}
                tt="uppercase"
                fz="xs"
                style={{ letterSpacing: "0.05em", padding: "12px 16px" }}
              >
                Trainer
              </Table.Th>
              <Table.Th
                c="dimmed"
                fw={600}
                tt="uppercase"
                fz="xs"
                style={{
                  letterSpacing: "0.05em",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Weight
              </Table.Th>
              <Table.Th
                c="dimmed"
                fw={600}
                tt="uppercase"
                fz="xs"
                style={{
                  letterSpacing: "0.05em",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Barrier
              </Table.Th>
              <Table.Th
                c="dimmed"
                fw={600}
                tt="uppercase"
                fz="xs"
                style={{
                  letterSpacing: "0.05em",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Form
              </Table.Th>
              <Table.Th
                c="dimmed"
                fw={600}
                tt="uppercase"
                fz="xs"
                style={{
                  letterSpacing: "0.05em",
                  padding: "12px 16px",
                  textAlign: "right",
                }}
              >
                Odds
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {race.participants.map((participant) => (
              <Table.Tr
                key={participant.position}
                style={{
                  borderBottom: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Table.Td p="md">
                  <Group gap="xs">
                    <Box
                      w={24}
                      h={24}
                      className={participant.silkColor}
                      style={{ borderRadius: "var(--mantine-radius-sm)" }}
                    />
                    <Text fw={700}>{participant.position}</Text>
                  </Group>
                </Table.Td>
                <Table.Td p="md">
                  <Text fw={600}>{participant.horseName}</Text>
                </Table.Td>
                <Table.Td p="md">
                  <Text c="dimmed">{participant.jockey}</Text>
                </Table.Td>
                <Table.Td p="md">
                  <Text c="dimmed">{participant.trainer}</Text>
                </Table.Td>
                <Table.Td p="md" style={{ textAlign: "center" }}>
                  <Text>{participant.weight}</Text>
                </Table.Td>
                <Table.Td p="md" style={{ textAlign: "center" }}>
                  <Badge variant="light">{participant.barrier}</Badge>
                </Table.Td>
                <Table.Td p="md" style={{ textAlign: "center" }}>
                  <Tooltip label="Recent form (last 3 races)">
                    <Text c="dimmed" ff="monospace" size="sm">
                      {participant.form}
                    </Text>
                  </Tooltip>
                </Table.Td>
                <Table.Td p="md" style={{ textAlign: "right" }}>
                  <Badge
                    size="lg"
                    variant="filled"
                    color={
                      Number.parseFloat(participant.odds.replace("$", "")) <= 3
                        ? "blue"
                        : Number.parseFloat(
                              participant.odds.replace("$", ""),
                            ) <= 6
                          ? "cyan"
                          : "gray"
                    }
                  >
                    {participant.odds}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Box px={{ base: "md", md: "xl" }} pb={{ base: "md", md: "xl" }}>
        <JockeyInsights participants={race.participants} />
      </Box>
    </Paper>
  );
}
