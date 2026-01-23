"use client";

import { Box, Container, SimpleGrid } from "@mantine/core";
import type { VenueSummary } from "@/lib/race-data";
import { VenueCard } from "./venue-card";

interface VenuesGridProps {
  venues: VenueSummary[];
}

export function VenuesGrid({ venues }: VenuesGridProps) {
  return (
    <Box component="section" py="xl">
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
