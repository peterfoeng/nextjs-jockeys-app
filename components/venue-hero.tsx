"use client";

import {
  Badge,
  Box,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCalendar,
  IconCloud,
  IconMapPin,
  IconRoad,
} from "@tabler/icons-react";
import type { Venue } from "@/lib/race-data";

interface VenueHeroProps {
  venue: Venue;
}

export function VenueHero({ venue }: VenueHeroProps) {
  return (
    <Box
      pos="relative"
      py={{ base: "xl", md: "64px" }}
      style={{
        background:
          "linear-gradient(to bottom, var(--mantine-color-default-hover), var(--mantine-color-body))",
      }}
    >
      <Container size="xl">
        <Group justify="space-between" align="flex-end" wrap="wrap" gap="xl">
          <Box>
            <Badge size="lg" variant="filled" color="blue" mb="md">
              LIVE TODAY
            </Badge>
            <Title
              order={1}
              size={{ base: "32px", md: "40px", lg: "48px" }}
              fw={700}
              mb="xs"
            >
              {venue.name}
            </Title>
            <Group gap="md" c="dimmed">
              <Group gap="xs">
                <IconMapPin size={16} />
                <Text size="sm">{venue.location}</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm">{venue.date}</Text>
              </Group>
            </Group>
          </Box>

          <SimpleGrid cols={{ base: 2, sm: 2 }} spacing="sm">
            <Paper withBorder p="md" radius="lg">
              <Group gap="xs" mb={4}>
                <IconCloud size={16} color="var(--mantine-color-cyan-filled)" />
                <Text
                  size="xs"
                  c="dimmed"
                  tt="uppercase"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Weather
                </Text>
              </Group>
              <Text fw={600}>{venue.weather}</Text>
            </Paper>
            <Paper withBorder p="md" radius="lg">
              <Group gap="xs" mb={4}>
                <IconRoad size={16} color="var(--mantine-color-blue-filled)" />
                <Text
                  size="xs"
                  c="dimmed"
                  tt="uppercase"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Track
                </Text>
              </Group>
              <Text fw={600}>{venue.trackCondition}</Text>
            </Paper>
          </SimpleGrid>
        </Group>
      </Container>
    </Box>
  );
}
