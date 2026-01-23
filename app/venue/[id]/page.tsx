"use client"

import { MantineProvider, createTheme } from "@mantine/core"
import "@mantine/core/styles.css"
import { Header } from "@/components/header"
import { VenueHero } from "@/components/venue-hero"
import { RaceList } from "@/components/race-list"
import { ColdJockeyAlert } from "@/components/cold-jockey-alert"
import { MeetingTally } from "@/components/meeting-tally"
import { venueData, venuesList } from "@/lib/race-data"
import { useParams } from "next/navigation"
import { Breadcrumbs, Anchor, Container } from "@mantine/core"
import Link from "next/link"

const theme = createTheme({
  primaryColor: "green",
  fontFamily: "Geist, sans-serif",
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
  },
})

export default function VenueDetailPage() {
  const params = useParams()
  const venueId = params.id as string

  // Find venue summary for breadcrumb, use main venueData for race details
  const venueSummary = venuesList.find((v) => v.id === venueId)
  const venueName = venueSummary?.name || venueData.name

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Container size="xl" py="md">
            <Breadcrumbs className="text-muted-foreground">
              <Anchor component={Link} href="/venues" className="text-muted-foreground hover:text-primary">
                All Venues
              </Anchor>
              <span className="text-foreground">{venueName}</span>
            </Breadcrumbs>
          </Container>
          <VenueHero venue={venueData} />

          <Container size="xl" py="md">
            <ColdJockeyAlert races={venueData.races} />
            <MeetingTally races={venueData.races} venueName={venueName} />
          </Container>

          <RaceList races={venueData.races} />
        </main>
        <footer className="bg-card border-t border-border py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground text-sm">© 2026 RacingHub. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </MantineProvider>
  )
}
