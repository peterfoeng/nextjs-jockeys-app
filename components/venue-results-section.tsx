"use client";

import {
  Accordion,
  Badge,
  Box,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { IconCloud, IconDroplet, IconMapPin } from "@tabler/icons-react";
import type { VenueResults } from "@/lib/results-data";
import { ResultsCard } from "./results-card";

interface VenueResultsSectionProps {
  venue: VenueResults;
}

export function VenueResultsSection({ venue }: VenueResultsSectionProps) {
  return (
    <Paper
      bg="var(--mantine-color-default)"
      withBorder
      style={{ overflow: "hidden" }}
    >
      {/* Venue Header */}
      <Box
        bg="var(--mantine-color-default)"
        px="xl"
        py="md"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group justify="space-between" wrap="wrap" gap="md">
          <Box>
            <Title order={2} size="xl" fw={700} mb={4}>
              {venue.name}
            </Title>
            <Group gap="md">
              <Group gap="xs">
                <IconMapPin size={16} color="var(--mantine-color-dimmed)" />
                <Text size="sm" c="dimmed">
                  {venue.location}
                </Text>
              </Group>
              <Group gap="xs">
                <IconCloud size={16} color="var(--mantine-color-dimmed)" />
                <Text size="sm" c="dimmed">
                  {venue.weather}
                </Text>
              </Group>
              <Group gap="xs">
                <IconDroplet size={16} color="var(--mantine-color-dimmed)" />
                <Badge size="sm" color="blue" variant="light">
                  {venue.trackCondition}
                </Badge>
              </Group>
            </Group>
          </Box>
          <Badge size="lg">{venue.completedRaces.length} Races Completed</Badge>
        </Group>
      </Box>

      {/* Race Results */}
      <Box p="md">
        <Accordion
          variant="separated"
          defaultValue={`race-${venue.completedRaces[0]?.raceNumber}`}
        >
          {venue.completedRaces.map((race) => (
            <Accordion.Item
              key={race.raceNumber}
              value={`race-${race.raceNumber}`}
              bg="var(--mantine-color-default-hover)"
              mb="xs"
            >
              <Accordion.Control>
                <Group justify="space-between" pr="md">
                  <Group gap="md">
                    <Badge color="blue" fw={700}>
                      R{race.raceNumber}
                    </Badge>
                    <Box>
                      <Text fw={500}>{race.raceName}</Text>
                      <Text size="xs" c="dimmed">
                        {race.time} • {race.distance} • {race.prize}
                      </Text>
                    </Box>
                  </Group>
                  <Group gap="sm">
                    <Box
                      w={12}
                      h={12}
                      className={race.results[0].silkColor}
                      style={{ borderRadius: "var(--mantine-radius-sm)" }}
                    />
                    <Text size="sm" c="blue" fw={600}>
                      {race.results[0].horseName}
                    </Text>
                    <Badge size="sm" color="cyan" variant="light">
                      {race.results[0].startingPrice}
                    </Badge>
                  </Group>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <ResultsCard race={race} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Box>
    </Paper>
  );
}
