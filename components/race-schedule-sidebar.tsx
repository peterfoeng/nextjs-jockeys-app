"use client";

import {
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Stack,
  ScrollArea,
} from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import type { Race } from "@/lib/race-data";

interface RaceScheduleSidebarProps {
  races: Race[];
  activeRace: number;
  onRaceSelect: (raceNumber: number) => void;
}

export function RaceScheduleSidebar({
  races,
  activeRace,
  onRaceSelect,
}: RaceScheduleSidebarProps) {
  return (
    <Paper className="bg-card border border-border rounded-xl p-4 sticky top-24">
      <Title order={5} className="text-foreground font-bold mb-4">
        Race Schedule
      </Title>
      <ScrollArea h={400}>
        <Stack gap="xs">
          {races.map((race) => {
            const isActive = race.raceNumber === activeRace;
            const isPast = false; // You can add logic to determine if race has passed

            return (
              <button
                key={race.raceNumber}
                onClick={() => onRaceSelect(race.raceNumber)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 border border-primary"
                    : "bg-secondary/30 border border-transparent hover:bg-secondary/50"
                }`}
              >
                <Group justify="space-between" mb="xs">
                  <Badge
                    size="sm"
                    variant={isActive ? "filled" : "light"}
                    className={
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }
                  >
                    R{race.raceNumber}
                  </Badge>
                  <Group gap="xs">
                    <IconClock size={12} className="text-muted-foreground" />
                    <Text size="xs" className="text-muted-foreground">
                      {race.time}
                    </Text>
                  </Group>
                </Group>
                <Text
                  size="sm"
                  className={`font-medium ${isActive ? "text-primary" : "text-foreground"}`}
                >
                  {race.raceName}
                </Text>
                <Text size="xs" className="text-muted-foreground">
                  {race.distance} • {race.prize}
                </Text>
              </button>
            );
          })}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}
