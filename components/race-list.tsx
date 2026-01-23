"use client";

import {
  Box,
  Button,
  Container,
  Group,
  ScrollArea,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import type { Race } from "@/lib/race-data";
import { RaceCard } from "./race-card";

interface RaceListProps {
  races: Race[];
}

export function RaceList({ races }: RaceListProps) {
  const [activeRace, setActiveRace] = useState<string>("1");

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <Box>
          <Text size="xl" fw={700}>
            Today{"'"}s Races
          </Text>
          <Text c="dimmed" size="sm">
            {races.length} races scheduled
          </Text>
        </Box>
        <Button
          variant="subtle"
          rightSection={<IconChevronRight size={16} />}
          c="blue"
        >
          View Full Race Card
        </Button>
      </Group>

      <Tabs
        value={activeRace}
        onChange={(value) => setActiveRace(value || "1")}
      >
        <ScrollArea type="never">
          <Tabs.List
            withBorder
            radius="xl"
            p={4}
            mb="xl"
            style={{ flexWrap: "nowrap" }}
          >
            {races.map((race) => (
              <Tabs.Tab
                key={race.raceNumber}
                value={race.raceNumber.toString()}
                px="md"
                py="sm"
                style={{
                  borderRadius: "var(--mantine-radius-lg)",
                  minWidth: "60px",
                }}
              >
                <Stack gap={0} align="center">
                  <Text size="xs" fw={700}>
                    R{race.raceNumber}
                  </Text>
                  <Text size="xs" opacity={0.8}>
                    {race.time.replace(" PM", "").replace(" AM", "")}
                  </Text>
                </Stack>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </ScrollArea>

        <Stack gap="lg">
          {races.map((race) => (
            <Tabs.Panel
              key={race.raceNumber}
              value={race.raceNumber.toString()}
            >
              <RaceCard race={race} />
            </Tabs.Panel>
          ))}
        </Stack>
      </Tabs>
    </Container>
  );
}
