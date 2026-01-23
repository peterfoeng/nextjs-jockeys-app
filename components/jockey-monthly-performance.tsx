"use client";

import {
  Box,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconChartBar,
  IconCoin,
  IconHorse,
  IconTrophy,
} from "@tabler/icons-react";
import type { JockeyProfile } from "@/lib/jockey-data";

interface JockeyMonthlyPerformanceProps {
  monthlyPerformance: JockeyProfile["monthlyPerformance"];
}

export function JockeyMonthlyPerformance({
  monthlyPerformance,
}: JockeyMonthlyPerformanceProps) {
  const maxWins = Math.max(...monthlyPerformance.map((m) => m.wins));

  return (
    <Paper withBorder radius="xl" p={{ base: "md", md: "xl" }}>
      <Group gap="sm" mb="xl">
        <ThemeIcon size="lg" radius="md" color="blue" variant="light">
          <IconChartBar size={20} />
        </ThemeIcon>
        <Box>
          <Title order={4} fw={700}>
            Monthly Performance
          </Title>
          <Text size="xs" c="dimmed">
            Recent months breakdown
          </Text>
        </Box>
      </Group>

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        {monthlyPerformance.map((month, idx) => {
          const isBest = month.wins === maxWins;
          const winRate = ((month.wins / month.starts) * 100).toFixed(0);

          return (
            <Paper
              key={month.month}
              radius="lg"
              p="md"
              bg={
                isBest
                  ? "var(--mantine-color-blue-light)"
                  : "var(--mantine-color-default-hover)"
              }
              withBorder={isBest}
              style={
                isBest
                  ? { borderColor: "var(--mantine-color-blue-outline)" }
                  : undefined
              }
            >
              <Text fw={600} mb="sm" c={isBest ? "blue" : undefined}>
                {month.month}
              </Text>

              <Stack gap="sm">
                <Group justify="space-between">
                  <Group gap={4}>
                    <IconTrophy
                      size={14}
                      color="var(--mantine-color-blue-filled)"
                    />
                    <Text size="xs" c="dimmed">
                      Wins
                    </Text>
                  </Group>
                  <Text fw={700}>{month.wins}</Text>
                </Group>

                <Group justify="space-between">
                  <Group gap={4}>
                    <IconHorse
                      size={14}
                      color="var(--mantine-color-cyan-filled)"
                    />
                    <Text size="xs" c="dimmed">
                      Starts
                    </Text>
                  </Group>
                  <Text fw={500}>{month.starts}</Text>
                </Group>

                <Group justify="space-between">
                  <Group gap={4}>
                    <IconCoin size={14} color="var(--mantine-color-dimmed)" />
                    <Text size="xs" c="dimmed">
                      Prize $
                    </Text>
                  </Group>
                  <Text fw={500}>{month.prizeMoney}</Text>
                </Group>

                <Box
                  pt="xs"
                  style={{
                    borderTop: "1px solid var(--mantine-color-default-border)",
                  }}
                >
                  <Text size="xs" c="dimmed" ta="center">
                    Strike Rate:{" "}
                    <Text
                      component="span"
                      fw={700}
                      c={isBest ? "blue" : undefined}
                    >
                      {winRate}%
                    </Text>
                  </Text>
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Paper>
  );
}
