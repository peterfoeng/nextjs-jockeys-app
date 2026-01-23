"use client";

import {
  Badge,
  Box,
  Container,
  Flex,
  Group,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconCalendar, IconSearch } from "@tabler/icons-react";

interface VenuesHeroProps {
  date: string;
  venueCount: number;
  totalRaces: number;
}

export function VenuesHero({ date, venueCount, totalRaces }: VenuesHeroProps) {
  return (
    <Box
      component="section"
      py={40}
      style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}
    >
      <Container size="xl">
        <Flex
          direction={{ base: "column", lg: "row" }}
          align={{ lg: "flex-end" }}
          justify={{ lg: "space-between" }}
          gap="xl"
        >
          <div>
            <Group gap="sm" mb="xs">
              <IconCalendar size={20} c="blue" />
              <Text size="sm" c="blue" fw={500}>
                {date}
              </Text>
            </Group>
            <Title order={1} fw={700} size="h1" mb="xs">
              Today{"'"}s Racing
            </Title>
            <Text c="dimmed" size="lg">
              Browse all venues and races happening today
            </Text>
            <Group gap="md" mt="md">
              <Badge size="lg" variant="light" color="blue">
                {venueCount} Venues
              </Badge>
              <Badge size="lg" variant="light" color="gray">
                {totalRaces} Races
              </Badge>
            </Group>
          </div>

          <Group gap="md" style={{ width: "100%" }} w={{ lg: "auto" }}>
            <TextInput
              placeholder="Search venues..."
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1 }}
              w={{ lg: 256 }}
            />
            <Select
              placeholder="Filter by state"
              data={["All States", "VIC", "NSW", "QLD", "SA", "WA", "TAS"]}
              defaultValue="All States"
              w={160}
            />
          </Group>
        </Flex>
      </Container>
    </Box>
  );
}
