"use client";

import { Header } from "@/components/header";
import { VenuesGrid } from "@/components/venues-grid";
import { VenuesHero } from "@/components/venues-hero";
import { venuesList } from "@/lib/race-data";

export default function VenuesPage() {
  const totalRaces = venuesList.reduce(
    (acc, venue) => acc + venue.raceCount,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <VenuesHero
          date="Thursday, January 9, 2026"
          venueCount={venuesList.length}
          totalRaces={totalRaces}
        />
        <VenuesGrid venues={venuesList} />
      </main>
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 RacingHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
