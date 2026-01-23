"use client";

import { Badge, Box, Button, Card, Group, Stack, Text } from "@mantine/core";
import {
  IconChevronRight,
  IconClock,
  IconCloud,
  IconMapPin,
  IconTrophy,
} from "@tabler/icons-react";
import Link from "next/link";
import type { VenueSummary } from "@/lib/race-data";
import classes from "./venue-card.module.css";

interface VenueCardProps {
  venue: VenueSummary;
}

export function VenueCard({ venue }: VenueCardProps) {
  const getTrackConditionColor = (condition: string) => {
    if (condition.includes("Good")) return "green";
    if (condition.includes("Soft")) return "yellow";
    if (condition.includes("Heavy")) return "red";
    return "gray";
  };

  return (
    <Card
      className={classes.venueCard}
      radius="lg"
      padding="lg"
      withBorder
      style={{
        transition: "all 0.3s",
        cursor: "pointer",
      }}
    >
      <Box className={classes.venueImage}>
        <img
          src={`/.jpg?height=160&width=400&query=${venue.imageQuery}`}
          alt={venue.name}
        />
        <Box className={classes.imageGradient} />
        <Box className={classes.imageBadge}>
          <Badge
            size="sm"
            color={getTrackConditionColor(venue.trackCondition)}
            fw={500}
          >
            {venue.trackCondition}
          </Badge>
        </Box>
      </Box>

      <Stack gap="sm">
        <div>
          <Text fw={700} size="lg">
            {venue.name}
          </Text>
          <Group gap="xs" c="dimmed">
            <IconMapPin size={14} />
            <Text size="sm">
              {venue.location}, {venue.state}
            </Text>
          </Group>
        </div>

        <Group gap="md" wrap="wrap">
          <Group gap="xs">
            <IconCloud size={16} c="dimmed" />
            <Text size="sm" c="dimmed">
              {venue.weather}
            </Text>
          </Group>
          <Group gap="xs">
            <IconClock size={16} c="dimmed" />
            <Text size="sm" c="dimmed">
              {venue.firstRaceTime} - {venue.lastRaceTime}
            </Text>
          </Group>
        </Group>

        <Group justify="space-between" align="center">
          <Group gap="sm">
            <Badge variant="light" color="gray">
              {venue.raceCount} Races
            </Badge>
            {venue.featuredRace && (
              <Group gap={4}>
                <IconTrophy size={14} c="cyan" />
                <Text size="xs" c="cyan" fw={500}>
                  {venue.featuredRace}
                </Text>
              </Group>
            )}
          </Group>
        </Group>

        <Button
          component={Link}
          href={`/venue/${venue.id}`}
          variant="light"
          color="blue"
          fullWidth
          rightSection={<IconChevronRight size={16} />}
          mt="xs"
        >
          View Races
        </Button>
      </Stack>
    </Card>
  );
}
