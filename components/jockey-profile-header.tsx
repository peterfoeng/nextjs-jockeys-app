"use client";

import {
  Avatar,
  Badge,
  Box,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendar,
  IconChartBar,
  IconFlag,
  IconFlame,
  IconTrendingUp,
  IconTrophy,
  IconWeight,
} from "@tabler/icons-react";
import type { JockeyProfile } from "@/lib/jockey-data";

interface JockeyProfileHeaderProps {
  jockey: JockeyProfile;
}

export function JockeyProfileHeader({ jockey }: JockeyProfileHeaderProps) {
  const hotStreak =
    jockey.daysSinceLastWin <= 1
      ? { label: "Hot Streak", color: "blue", variant: "light" as const }
      : jockey.daysSinceLastWin <= 4
        ? { label: "In Form", color: "cyan", variant: "light" as const }
        : null;

  return (
    <Paper withBorder radius="xl" style={{ overflow: "hidden" }}>
      {/* Hero Banner */}
      <Box
        h={{ base: 128, md: 160 }}
        pos="relative"
        style={{
          background:
            "linear-gradient(to right, var(--mantine-color-blue-light), var(--mantine-color-blue-light-hover), transparent)",
        }}
      >
        <Box
          pos="absolute"
          style={{
            inset: 0,
            backgroundImage: "url('/horse-racing-track-panorama.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        />
      </Box>

      <Box
        px={{ base: "md", md: "xl" }}
        pb="xl"
        mt={{ base: -64, md: -80 }}
        pos="relative"
      >
        <Group gap="xl" align="flex-start" wrap="wrap">
          {/* Avatar */}
          <Avatar
            src={jockey.photo}
            size={120}
            radius="xl"
            style={{
              border: "4px solid var(--mantine-color-body)",
              boxShadow: "var(--mantine-shadow-xl)",
            }}
          />

          {/* Main Info */}
          <Box style={{ flex: 1 }}>
            <Group
              justify="space-between"
              align="flex-start"
              wrap="wrap"
              gap="md"
            >
              <Box>
                <Group gap="sm" mb="xs">
                  <Title order={1} size={{ base: "xl", md: "32px" }} fw={700}>
                    {jockey.name}
                  </Title>
                  {hotStreak && (
                    <Badge
                      size="lg"
                      variant={hotStreak.variant}
                      color={hotStreak.color}
                      leftSection={<IconFlame size={14} />}
                    >
                      {hotStreak.label}
                    </Badge>
                  )}
                </Group>
                <Group gap="md" c="dimmed">
                  <Group gap={4}>
                    <IconFlag size={16} />
                    <Text size="sm">{jockey.nationality}</Text>
                  </Group>
                  <Group gap={4}>
                    <IconCalendar size={16} />
                    <Text size="sm">{jockey.age} years old</Text>
                  </Group>
                  <Group gap={4}>
                    <IconWeight size={16} />
                    <Text size="sm">{jockey.weight}</Text>
                  </Group>
                </Group>
              </Box>

              {/* Strike Rate Badge */}
              <Box
                ta="center"
                bg="var(--mantine-color-blue-light)"
                style={{ borderRadius: "var(--mantine-radius-xl)" }}
                px="xl"
                py="sm"
              >
                <Text c="blue" size="32px" fw={700}>
                  {jockey.strikeRate}%
                </Text>
                <Text
                  size="xs"
                  c="dimmed"
                  tt="uppercase"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Strike Rate
                </Text>
              </Box>
            </Group>

            {/* Bio */}
            <Text
              c="dimmed"
              mt="md"
              size={{ base: "sm", md: "md" }}
              style={{ lineHeight: 1.6, maxWidth: "48rem" }}
            >
              {jockey.bio}
            </Text>
          </Box>
        </Group>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 2, sm: 4, lg: 6 }} spacing="md" mt="xl">
          <Paper
            bg="var(--mantine-color-default-hover)"
            radius="lg"
            p="md"
            ta="center"
          >
            <ThemeIcon
              size="lg"
              radius="md"
              color="blue"
              variant="light"
              mx="auto"
              mb="xs"
            >
              <IconTrophy size={20} />
            </ThemeIcon>
            <Text size="xl" fw={700}>
              {jockey.careerWins.toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed">
              Career Wins
            </Text>
          </Paper>

          <Paper
            bg="var(--mantine-color-default-hover)"
            radius="lg"
            p="md"
            ta="center"
          >
            <ThemeIcon
              size="lg"
              radius="md"
              color="cyan"
              variant="light"
              mx="auto"
              mb="xs"
            >
              <IconChartBar size={20} />
            </ThemeIcon>
            <Text size="xl" fw={700}>
              {jockey.groupOneWins}
            </Text>
            <Text size="xs" c="dimmed">
              Group 1 Wins
            </Text>
          </Paper>

          <Paper
            bg="var(--mantine-color-default-hover)"
            radius="lg"
            p="md"
            ta="center"
          >
            <ThemeIcon
              size="lg"
              radius="md"
              color="blue"
              variant="light"
              mx="auto"
              mb="xs"
            >
              <IconTrendingUp size={20} />
            </ThemeIcon>
            <Text size="xl" fw={700}>
              {jockey.seasonWins}
            </Text>
            <Text size="xs" c="dimmed">
              Season Wins
            </Text>
          </Paper>

          <Paper
            bg="var(--mantine-color-default-hover)"
            radius="lg"
            p="md"
            ta="center"
          >
            <Text size="xl" fw={700}>
              {jockey.careerPrizeMoney}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Career Prize Money
            </Text>
          </Paper>

          <Paper
            bg="var(--mantine-color-default-hover)"
            radius="lg"
            p="md"
            ta="center"
          >
            <Text size="xl" fw={700}>
              {jockey.placeRate}%
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Place Rate
            </Text>
          </Paper>

          <Paper
            bg="var(--mantine-color-default-hover)"
            radius="lg"
            p="md"
            ta="center"
          >
            <Text size="xl" fw={700}>
              {jockey.careerStarts.toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Career Starts
            </Text>
          </Paper>
        </SimpleGrid>

        {/* Recent Form Visualization */}
        <Paper
          bg="var(--mantine-color-default-hover)"
          radius="lg"
          p="md"
          mt="md"
        >
          <Group justify="space-between" mb="sm">
            <Text fw={600}>
              Recent Form (Last {jockey.recentForm.total} rides)
            </Text>
            <Group gap="lg">
              <Group gap={4}>
                <Box
                  w={12}
                  h={12}
                  style={{
                    borderRadius: "var(--mantine-radius-sm)",
                    backgroundColor: "var(--mantine-color-blue-filled)",
                  }}
                />
                <Text size="xs" c="dimmed">
                  {jockey.recentForm.wins} Wins
                </Text>
              </Group>
              <Group gap={4}>
                <Box
                  w={12}
                  h={12}
                  style={{
                    borderRadius: "var(--mantine-radius-sm)",
                    backgroundColor: "var(--mantine-color-cyan-filled)",
                  }}
                />
                <Text size="xs" c="dimmed">
                  {jockey.recentForm.places} Places
                </Text>
              </Group>
            </Group>
          </Group>
          <Progress.Root size="lg" radius="md">
            <Tooltip
              label={`${jockey.recentForm.wins} Wins (${((jockey.recentForm.wins / jockey.recentForm.total) * 100).toFixed(0)}%)`}
            >
              <Progress.Section
                value={(jockey.recentForm.wins / jockey.recentForm.total) * 100}
                color="blue"
              />
            </Tooltip>
            <Tooltip label={`${jockey.recentForm.places} Places`}>
              <Progress.Section
                value={
                  (jockey.recentForm.places / jockey.recentForm.total) * 100
                }
                color="cyan"
              />
            </Tooltip>
          </Progress.Root>
        </Paper>
      </Box>
    </Paper>
  );
}
