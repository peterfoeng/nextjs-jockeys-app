"use client";

import {
  Badge,
  Box,
  Divider,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Tabs,
  Text,
} from "@mantine/core";
import { IconCash, IconChartBar, IconTrophy } from "@tabler/icons-react";
import type { CompletedRace } from "@/lib/results-data";

interface ResultsCardProps {
  race: CompletedRace;
}

function getPositionBadge(position: number) {
  if (position === 1) {
    return (
      <Badge
        size="lg"
        style={{ backgroundColor: "#eab308", color: "#422006" }}
        fw={700}
      >
        1st
      </Badge>
    );
  }
  if (position === 2) {
    return (
      <Badge
        size="lg"
        style={{ backgroundColor: "#d4d4d8", color: "#27272a" }}
        fw={700}
      >
        2nd
      </Badge>
    );
  }
  if (position === 3) {
    return (
      <Badge
        size="lg"
        style={{ backgroundColor: "#d97706", color: "#fffbeb" }}
        fw={700}
      >
        3rd
      </Badge>
    );
  }
  return (
    <Badge size="lg" variant="outline" c="dimmed">
      {position}th
    </Badge>
  );
}

export function ResultsCard({ race }: ResultsCardProps) {
  return (
    <Paper withBorder style={{ overflow: "hidden" }}>
      {/* Race Header */}
      <Box
        bg="var(--mantine-color-default-hover)"
        px="md"
        py="sm"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group justify="space-between" wrap="wrap" gap="sm">
          <Group gap="md">
            <Badge size="lg" color="blue" fw={700}>
              Race {race.raceNumber}
            </Badge>
            <Box>
              <Text fw={600}>{race.raceName}</Text>
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  {race.distance}
                </Text>
                <Text size="sm" c="dimmed">
                  •
                </Text>
                <Text size="sm" c="dimmed">
                  {race.prize}
                </Text>
                <Text size="sm" c="dimmed">
                  •
                </Text>
                <Badge size="sm" variant="outline" c="dimmed">
                  {race.raceType}
                </Badge>
              </Group>
            </Box>
          </Group>
          <Group gap="md">
            <Box ta="right">
              <Text size="xs" c="dimmed">
                Winning Time
              </Text>
              <Text fw={700}>{race.winningTime}</Text>
            </Box>
            <Box ta="right">
              <Text size="xs" c="dimmed">
                Last 400m
              </Text>
              <Text fw={700}>{race.lastQuarter}</Text>
            </Box>
          </Group>
        </Group>
      </Box>

      <Tabs defaultValue="results" p="md">
        <Tabs.List mb="md">
          <Tabs.Tab value="results" leftSection={<IconTrophy size={16} />}>
            Results
          </Tabs.Tab>
          <Tabs.Tab value="dividends" leftSection={<IconCash size={16} />}>
            Dividends
          </Tabs.Tab>
          <Tabs.Tab value="sectionals" leftSection={<IconChartBar size={16} />}>
            Sectionals
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="results">
          <ScrollArea>
            <Table striped={false} highlightOnHover={false}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th c="dimmed">Pos</Table.Th>
                  <Table.Th c="dimmed">Horse</Table.Th>
                  <Table.Th c="dimmed">Jockey</Table.Th>
                  <Table.Th c="dimmed">Trainer</Table.Th>
                  <Table.Th c="dimmed" ta="center">
                    Bar
                  </Table.Th>
                  <Table.Th c="dimmed" ta="center">
                    Wgt
                  </Table.Th>
                  <Table.Th c="dimmed" ta="right">
                    Time
                  </Table.Th>
                  <Table.Th c="dimmed" ta="right">
                    Margin
                  </Table.Th>
                  <Table.Th c="dimmed" ta="right">
                    SP
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {race.results.map((result) => (
                  <Table.Tr
                    key={result.position}
                    bg={
                      result.position <= 3
                        ? "var(--mantine-color-default-hover)"
                        : undefined
                    }
                  >
                    <Table.Td>{getPositionBadge(result.position)}</Table.Td>
                    <Table.Td>
                      <Group gap="sm">
                        <Box
                          w={16}
                          h={16}
                          className={result.silkColor}
                          style={{ borderRadius: "var(--mantine-radius-sm)" }}
                        />
                        <Text fw={500}>{result.horseName}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{result.jockey}</Table.Td>
                    <Table.Td c="dimmed">{result.trainer}</Table.Td>
                    <Table.Td ta="center" c="dimmed">
                      {result.barrier}
                    </Table.Td>
                    <Table.Td ta="center" c="dimmed">
                      {result.weight}
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text ff="monospace">{result.finishTime}</Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text
                        c={result.position === 1 ? "blue" : "dimmed"}
                        fw={result.position === 1 ? 700 : undefined}
                      >
                        {result.margin}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Badge
                        size="md"
                        color={result.position === 1 ? "blue" : "gray"}
                        variant={result.position === 1 ? "light" : "filled"}
                        style={
                          result.position === 1
                            ? {
                                borderColor:
                                  "var(--mantine-color-blue-outline)",
                                borderWidth: 1,
                                borderStyle: "solid",
                              }
                            : undefined
                        }
                      >
                        {result.startingPrice}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="dividends">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="sm">
                <Text size="sm" c="dimmed" fw={600} mb="xs">
                  Win & Place
                </Text>
                {race.dividends
                  .filter((d) => d.type === "Win" || d.type === "Place")
                  .map((dividend, idx) => (
                    <Paper
                      key={idx}
                      bg="var(--mantine-color-default-hover)"
                      p="sm"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Group gap="sm">
                        <Badge
                          size="sm"
                          color={dividend.type === "Win" ? "blue" : "gray"}
                        >
                          {dividend.type}
                        </Badge>
                        <Text size="sm">{dividend.combination}</Text>
                      </Group>
                      <Text fw={700}>{dividend.payout}</Text>
                    </Paper>
                  ))}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="sm">
                <Text size="sm" c="dimmed" fw={600} mb="xs">
                  Exotic Bets
                </Text>
                {race.dividends
                  .filter((d) => d.type !== "Win" && d.type !== "Place")
                  .map((dividend, idx) => (
                    <Paper
                      key={idx}
                      bg="var(--mantine-color-default-hover)"
                      p="sm"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Group gap="sm">
                        <Badge size="sm" color="cyan">
                          {dividend.type}
                        </Badge>
                        <Text size="sm" c="dimmed" ff="monospace">
                          {dividend.combination}
                        </Text>
                      </Group>
                      <Text fw={700}>{dividend.payout}</Text>
                    </Paper>
                  ))}
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="sectionals">
          <Stack gap="md">
            <Paper bg="var(--mantine-color-default-hover)" p="md">
              <Group gap="xl" wrap="wrap">
                <Box>
                  <Text size="xs" c="dimmed" mb={4}>
                    Winning Time
                  </Text>
                  <Text size="xl" fw={700}>
                    {race.winningTime}
                  </Text>
                </Box>
                <Divider
                  orientation="vertical"
                  display={{ base: "none", sm: "block" }}
                  h={48}
                />
                <Box>
                  <Text size="xs" c="dimmed" mb={4}>
                    Last 400m
                  </Text>
                  <Text size="xl" fw={700}>
                    {race.lastQuarter}
                  </Text>
                </Box>
                <Divider
                  orientation="vertical"
                  display={{ base: "none", sm: "block" }}
                  h={48}
                />
                <Box>
                  <Text size="xs" c="dimmed" mb={4}>
                    Track Condition
                  </Text>
                  <Badge size="lg" color="blue" variant="light">
                    {race.trackCondition}
                  </Badge>
                </Box>
              </Group>
            </Paper>

            <Box>
              <Text size="sm" c="dimmed" mb="xs">
                Sectional Times
              </Text>
              <Group gap="sm">
                {race.sectionals.split(" - ").map((time, idx) => (
                  <Paper
                    key={idx}
                    bg="var(--mantine-color-default-hover)"
                    px="md"
                    py="xs"
                    ta="center"
                  >
                    <Text size="xs" c="dimmed">
                      {idx === 0
                        ? "First"
                        : idx === race.sectionals.split(" - ").length - 1
                          ? "Final"
                          : `Sec ${idx + 1}`}
                    </Text>
                    <Text ff="monospace" fw={700}>
                      {time}
                    </Text>
                  </Paper>
                ))}
              </Group>
            </Box>

            {/* Winner highlight */}
            <Paper
              bg="var(--mantine-color-blue-light)"
              withBorder
              style={{ borderColor: "var(--mantine-color-blue-outline)" }}
              p="md"
            >
              <Group gap="md">
                <IconTrophy
                  size={32}
                  color="var(--mantine-color-blue-filled)"
                />
                <Box>
                  <Text fw={700} size="lg">
                    {race.results[0].horseName}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Ridden by {race.results[0].jockey} • Trained by{" "}
                    {race.results[0].trainer}
                  </Text>
                </Box>
                <Badge size="xl" color="blue" ml="auto">
                  Winner
                </Badge>
              </Group>
            </Paper>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}
