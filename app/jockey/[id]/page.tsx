import { Container, SimpleGrid } from "@mantine/core"
import { Header } from "@/components/header"
import { JockeyProfileHeader } from "@/components/jockey-profile-header"
import { JockeyRecentWins } from "@/components/jockey-recent-wins"
import { JockeyTrainerPartnerships } from "@/components/jockey-trainer-partnerships"
import { JockeyVenueStats } from "@/components/jockey-venue-stats"
import { JockeyMonthlyPerformance } from "@/components/jockey-monthly-performance"
import { jockeyProfiles } from "@/lib/jockey-data"
import { notFound } from "next/navigation"

interface JockeyPageProps {
  params: Promise<{ id: string }>
}

export default async function JockeyPage({ params }: JockeyPageProps) {
  const { id } = await params
  const jockey = jockeyProfiles[id]

  if (!jockey) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Container size="xl" className="py-6">
        <div className="space-y-6">
          <JockeyProfileHeader jockey={jockey} />

          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
            <JockeyTrainerPartnerships partnerships={jockey.trainerPartnerships} />
            <JockeyMonthlyPerformance monthlyPerformance={jockey.monthlyPerformance} />
          </SimpleGrid>

          <JockeyVenueStats venueStats={jockey.venueStats} distanceStats={jockey.distanceStats} />

          <JockeyRecentWins wins={jockey.recentWins} />
        </div>
      </Container>
    </div>
  )
}
