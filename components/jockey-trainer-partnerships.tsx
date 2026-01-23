"use client";

import {
  Badge,
  Box,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCoin, IconTrophy, IconUsers } from "@tabler/icons-react";
import type { JockeyProfile } from "@/lib/jockey-data";

interface JockeyTrainerPartnershipsProps {
  partnerships: JockeyProfile["trainerPartnerships"];
}

export function JockeyTrainerPartnerships({
  partnerships,
}: JockeyTrainerPartnershipsProps) {
  const maxWins = Math.max(...partnerships.map((p) => p.wins));

  return (
    <Paper withBorder radius="xl" p={{ base: "md", md: "xl" }}>
      <Group gap="sm" mb="xl">
        <ThemeIcon size="lg" radius="md" color="cyan" variant="light">
          <IconUsers size={20} />
        </ThemeIcon>
        <Box>
          <Title order={4} fw={700}>
            Trainer Partnerships
          </Title>
          <Text size="xs" c="dimmed">
            Most successful trainer combinations
          </Text>
        </Box>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {partnerships.map((partnership, idx) => {
          const winRate = (
            (partnership.wins / partnership.starts) *
            100
          ).toFixed(1);
          const isTop = idx === 0;

          return (
            <Paper
              key={partnership.trainer}
              radius="lg"
              p="md"
              bg={
                isTop
                  ? "var(--mantine-color-blue-light)"
                  : "var(--mantine-color-default-hover)"
              }
              withBorder
              style={
                isTop
                  ? { borderColor: "var(--mantine-color-blue-outline)" }
                  : { borderColor: "var(--mantine-color-default-border)" }
              }
            >
              <Group justify="space-between" align="flex-start" mb="sm">
                <Box>
                  <Group gap="xs">
                    <Text fw={600} c={isTop ? "blue" : undefined}>
                      {partnership.trainer}
                    </Text>
                    {isTop && (
                      <Badge size="xs" variant="light" color="blue">
                        Top Partner
                      </Badge>
                    )}
                  </Group>
                  <Text size="xs" c="dimmed">
                    {partnership.starts} starts together
                  </Text>
                </Box>
                <Badge size="lg" color={isTop ? "blue" : "gray"}>
                  {winRate}%
                </Badge>
              </Group>

              <Stack gap="xs">
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
                  <Text size="sm" fw={500}>
                    {partnership.wins}
                  </Text>
                </Group>
                <Progress
                  value={(partnership.wins / maxWins) * 100}
                  size="sm"
                  radius="xl"
                  color={isTop ? "blue" : "gray"}
                />
                <Group justify="space-between" pt={4}>
                  <Group gap={4}>
                    <IconCoin
                      size={14}
                      color="var(--mantine-color-cyan-filled)"
                    />
                    <Text size="xs" c="dimmed">
                      Prize Money
                    </Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    {partnership.prizeMoney}
                  </Text>
                </Group>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Paper>
  );
}
