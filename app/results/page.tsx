import { Container, Stack } from "@mantine/core"
import { Header } from "@/components/header"
import { ResultsHero } from "@/components/results-hero"
import { VenueResultsSection } from "@/components/venue-results-section"
import { resultsData } from "@/lib/results-data"

export default function ResultsPage() {
  const totalRaces = resultsData.reduce((acc, venue) => acc + venue.completedRaces.length, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ResultsHero totalVenues={resultsData.length} totalRaces={totalRaces} date="Wednesday, January 8, 2026" />
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {resultsData.map((venue) => (
            <VenueResultsSection key={venue.id} venue={venue} />
          ))}
        </Stack>
      </Container>
    </div>
  )
}
