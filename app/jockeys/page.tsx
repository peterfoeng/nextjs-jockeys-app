"use client"

import { useState, useMemo } from "react"
import {
  Container,
  SimpleGrid,
  Title,
  Text,
  Paper,
  Badge,
  Group,
  Avatar,
  ThemeIcon,
  SegmentedControl,
  Select,
  Table,
  Accordion,
  Divider,
  Stack,
} from "@mantine/core"
import {
  IconTrophy,
  IconFlame,
  IconTrendingUp,
  IconChevronRight,
  IconFilter,
  IconCalendar,
  IconMapPin,
  IconHorseToy,
} from "@tabler/icons-react"
import { Header } from "@/components/header"
import { jockeyProfiles, getJockeyIdFromShortName } from "@/lib/jockey-data"
import { venuesList } from "@/lib/race-data"
import { EdgeFinder } from "@/components/edge-finder"
import Link from "next/link"

const jockeysRunningToday: Record<
  string,
  {
    jockeyName: string
    rides: number
    firstRide: string
    mounts: { race: number; horse: string; odds: string }[]
  }[]
> = {
  flemington: [
    {
      jockeyName: "J. McDonald",
      rides: 6,
      firstRide: "12:30 PM",
      mounts: [
        { race: 1, horse: "Thunder Strike", odds: "$3.50" },
        { race: 3, horse: "Champion Spirit", odds: "$3.00" },
        { race: 5, horse: "Fast Track", odds: "$4.20" },
        { race: 7, horse: "Golden Glory", odds: "$5.50" },
        { race: 8, horse: "Star Power", odds: "$2.80" },
        { race: 9, horse: "Final Sprint", odds: "$6.00" },
      ],
    },
    {
      jockeyName: "J. Kah",
      rides: 7,
      firstRide: "1:05 PM",
      mounts: [
        { race: 2, horse: "Pacific Dream", odds: "$2.50" },
        { race: 3, horse: "Steel Heart", odds: "$8.00" },
        { race: 4, horse: "Ocean Wave", odds: "$4.50" },
        { race: 5, horse: "Desert Rose", odds: "$3.20" },
        { race: 6, horse: "Night Shadow", odds: "$5.80" },
        { race: 8, horse: "Bold Move", odds: "$4.00" },
        { race: 9, horse: "Lucky Strike", odds: "$7.50" },
      ],
    },
    {
      jockeyName: "D. Oliver",
      rides: 5,
      firstRide: "12:30 PM",
      mounts: [
        { race: 1, horse: "Midnight Sun", odds: "$4.20" },
        { race: 3, horse: "Bold Warrior", odds: "$4.50" },
        { race: 5, horse: "Storm King", odds: "$6.00" },
        { race: 7, horse: "Silver Stream", odds: "$8.50" },
        { race: 9, horse: "Thunder Road", odds: "$5.00" },
      ],
    },
    {
      jockeyName: "H. Bowman",
      rides: 5,
      firstRide: "12:30 PM",
      mounts: [
        { race: 1, horse: "Storm Chaser", odds: "$6.00" },
        { race: 3, horse: "Victory Lane", odds: "$3.60" },
        { race: 6, horse: "Fast Lane", odds: "$4.80" },
        { race: 7, horse: "Dark Horse", odds: "$12.00" },
        { race: 9, horse: "Final Charge", odds: "$9.00" },
      ],
    },
    {
      jockeyName: "C. Williams",
      rides: 4,
      firstRide: "12:30 PM",
      mounts: [
        { race: 1, horse: "Golden Dawn", odds: "$2.80" },
        { race: 3, horse: "Rising Star", odds: "$6.50" },
        { race: 6, horse: "Quick Silver", odds: "$5.50" },
        { race: 8, horse: "Champion Run", odds: "$3.80" },
      ],
    },
    {
      jockeyName: "D. Lane",
      rides: 4,
      firstRide: "1:05 PM",
      mounts: [
        { race: 2, horse: "Desert Wind", odds: "$3.80" },
        { race: 4, horse: "Mountain Peak", odds: "$5.20" },
        { race: 7, horse: "Swift Runner", odds: "$4.50" },
        { race: 9, horse: "Final Glory", odds: "$8.00" },
      ],
    },
  ],
  randwick: [
    {
      jockeyName: "J. McDonald",
      rides: 5,
      firstRide: "12:45 PM",
      mounts: [
        { race: 1, horse: "Sea Breeze", odds: "$2.90" },
        { race: 3, horse: "Harbour View", odds: "$3.50" },
        { race: 5, horse: "Sydney Star", odds: "$4.20" },
        { race: 7, horse: "Royal Pride", odds: "$5.00" },
        { race: 8, horse: "Final Touch", odds: "$3.80" },
      ],
    },
    {
      jockeyName: "H. Bowman",
      rides: 6,
      firstRide: "12:45 PM",
      mounts: [
        { race: 1, horse: "Ocean Rider", odds: "$4.50" },
        { race: 2, horse: "Storm Surge", odds: "$3.20" },
        { race: 4, horse: "Beach Runner", odds: "$5.80" },
        { race: 5, horse: "Coastal King", odds: "$6.50" },
        { race: 7, horse: "Wave Dancer", odds: "$4.00" },
        { race: 8, horse: "Harbour Star", odds: "$7.00" },
      ],
    },
    {
      jockeyName: "J. Kah",
      rides: 4,
      firstRide: "1:20 PM",
      mounts: [
        { race: 2, horse: "City Lights", odds: "$2.60" },
        { race: 4, horse: "Urban Star", odds: "$3.40" },
        { race: 6, horse: "Metro Magic", odds: "$4.80" },
        { race: 8, horse: "Sydney Dreams", odds: "$5.50" },
      ],
    },
  ],
  "eagle-farm": [
    {
      jockeyName: "D. Lane",
      rides: 6,
      firstRide: "1:00 PM",
      mounts: [
        { race: 1, horse: "Tropical Storm", odds: "$3.20" },
        { race: 2, horse: "Brisbane Belle", odds: "$4.50" },
        { race: 3, horse: "Gold Coast", odds: "$2.80" },
        { race: 5, horse: "Sunshine State", odds: "$5.00" },
        { race: 6, horse: "Queensland Pride", odds: "$6.50" },
        { race: 7, horse: "Final Heat", odds: "$4.20" },
      ],
    },
    {
      jockeyName: "D. Oliver",
      rides: 4,
      firstRide: "1:35 PM",
      mounts: [
        { race: 2, horse: "River Run", odds: "$5.50" },
        { race: 4, horse: "Palm Beach", odds: "$3.80" },
        { race: 6, horse: "Coral Sea", odds: "$7.00" },
        { race: 7, horse: "Barrier Reef", odds: "$4.50" },
      ],
    },
  ],
  morphettville: [
    {
      jockeyName: "C. Williams",
      rides: 5,
      firstRide: "12:15 PM",
      mounts: [
        { race: 1, horse: "Adelaide Star", odds: "$3.00" },
        { race: 3, horse: "Wine Country", odds: "$4.20" },
        { race: 5, horse: "Barossa Belle", odds: "$5.50" },
        { race: 7, horse: "Southern Cross", odds: "$3.80" },
        { race: 8, horse: "Final Toast", odds: "$6.00" },
      ],
    },
  ],
  ascot: [
    {
      jockeyName: "D. Lane",
      rides: 4,
      firstRide: "2:00 PM",
      mounts: [
        { race: 1, horse: "Perth Pride", odds: "$2.80" },
        { race: 3, horse: "Swan River", odds: "$4.50" },
        { race: 6, horse: "Western Star", odds: "$3.20" },
        { race: 9, horse: "Sunset Strip", odds: "$5.80" },
      ],
    },
  ],
}

type FilterType = "all" | "hot" | "strike-rate" | "prize-money" | "g1-wins"

export default function JockeysPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [sortBy, setSortBy] = useState<string | null>("season-wins")

  const jockeys = Object.values(jockeyProfiles)

  const filteredAndSortedJockeys = useMemo(() => {
    let filtered = [...jockeys]

    // Apply filter
    switch (filter) {
      case "hot":
        filtered = filtered.filter((j) => j.daysSinceLastWin <= 2)
        break
      case "strike-rate":
        filtered = filtered.filter((j) => j.strikeRate >= 25)
        break
      case "prize-money":
        filtered = filtered.filter((j) => {
          const prize = Number.parseFloat(j.seasonPrizeMoney.replace(/[$M,]/g, ""))
          return prize >= 10
        })
        break
      case "g1-wins":
        filtered = filtered.filter((j) => j.groupOneWins >= 50)
        break
    }

    // Apply sorting
    switch (sortBy) {
      case "season-wins":
        filtered.sort((a, b) => b.seasonWins - a.seasonWins)
        break
      case "strike-rate":
        filtered.sort((a, b) => b.strikeRate - a.strikeRate)
        break
      case "prize-money":
        filtered.sort((a, b) => {
          const prizeA = Number.parseFloat(a.seasonPrizeMoney.replace(/[$M,]/g, ""))
          const prizeB = Number.parseFloat(b.seasonPrizeMoney.replace(/[$M,]/g, ""))
          return prizeB - prizeA
        })
        break
      case "g1-wins":
        filtered.sort((a, b) => b.groupOneWins - a.groupOneWins)
        break
      case "recent-form":
        filtered.sort((a, b) => a.daysSinceLastWin - b.daysSinceLastWin)
        break
    }

    return filtered
  }, [jockeys, filter, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/20 via-primary/5 to-transparent py-12 md:py-16">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto">
            <Title className="text-foreground text-3xl md:text-4xl font-bold mb-4">Jockey Profiles</Title>
            <Text className="text-muted-foreground text-lg">
              Explore detailed statistics, recent form, and career highlights for Australia{"'"}s top jockeys
            </Text>
          </div>
        </Container>
      </div>

      <Container size="xl" className="py-8">
        <div className="mb-12">
          <EdgeFinder />
        </div>

        <Divider className="border-border mb-8" />

        {/* Filter controls */}
        <Paper className="bg-card border border-border rounded-xl p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <Group gap="sm">
              <ThemeIcon size="md" radius="md" className="bg-primary/20 text-primary">
                <IconFilter size={16} />
              </ThemeIcon>
              <Text className="text-foreground font-medium">Filter Jockeys</Text>
            </Group>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <SegmentedControl
                value={filter}
                onChange={(v) => setFilter(v as FilterType)}
                data={[
                  { label: "All", value: "all" },
                  { label: "Hot Streak", value: "hot" },
                  { label: "High Strike Rate", value: "strike-rate" },
                  { label: "Top Earners", value: "prize-money" },
                  { label: "G1 Winners", value: "g1-wins" },
                ]}
                className="bg-secondary"
                styles={{
                  root: { backgroundColor: "hsl(var(--secondary))" },
                  label: { color: "hsl(var(--foreground))" },
                }}
              />

              <Select
                value={sortBy}
                onChange={setSortBy}
                data={[
                  { value: "season-wins", label: "Season Wins" },
                  { value: "strike-rate", label: "Strike Rate" },
                  { value: "prize-money", label: "Prize Money" },
                  { value: "g1-wins", label: "Group 1 Wins" },
                  { value: "recent-form", label: "Recent Form" },
                ]}
                placeholder="Sort by"
                className="w-full sm:w-48"
                styles={{
                  input: {
                    backgroundColor: "hsl(var(--secondary))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  },
                  dropdown: {
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  },
                  option: {
                    color: "hsl(var(--foreground))",
                  },
                }}
              />
            </div>
          </div>

          {/* Filter stats */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-border">
            <Badge variant="light" className="bg-primary/10 text-primary">
              {filteredAndSortedJockeys.length} jockeys
            </Badge>
            {filter !== "all" && (
              <Badge variant="light" className="bg-accent/10 text-accent">
                {filter === "hot" && "Won within 2 days"}
                {filter === "strike-rate" && "25%+ strike rate"}
                {filter === "prize-money" && "$10M+ this season"}
                {filter === "g1-wins" && "50+ Group 1 wins"}
              </Badge>
            )}
          </div>
        </Paper>

        {/* Leaderboard Section */}
        <div className="mb-12">
          <Group gap="sm" className="mb-4">
            <ThemeIcon size="lg" radius="md" className="bg-primary/20 text-primary">
              <IconTrophy size={20} />
            </ThemeIcon>
            <Title order={3} className="text-foreground font-bold">
              Season Leaderboard
            </Title>
          </Group>

          {filteredAndSortedJockeys.length === 0 ? (
            <Paper className="bg-card border border-border rounded-xl p-8 text-center">
              <Text className="text-muted-foreground">No jockeys match the selected filters</Text>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {filteredAndSortedJockeys.map((jockey, idx) => {
                const hotStreak =
                  jockey.daysSinceLastWin <= 1
                    ? { label: "Hot", color: "text-primary", bg: "bg-primary/20", icon: IconFlame }
                    : jockey.daysSinceLastWin <= 4
                      ? { label: "In Form", color: "text-accent", bg: "bg-accent/20", icon: IconTrendingUp }
                      : null

                return (
                  <Link key={jockey.id} href={`/jockey/${jockey.id}`} className="block">
                    <Paper className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:bg-card/80 transition-all cursor-pointer group">
                      <div className="flex items-start gap-4">
                        {/* Rank */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            idx === 0
                              ? "bg-yellow-500/20 text-yellow-500"
                              : idx === 1
                                ? "bg-gray-400/20 text-gray-400"
                                : idx === 2
                                  ? "bg-amber-600/20 text-amber-600"
                                  : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {idx + 1}
                        </div>

                        {/* Avatar */}
                        <Avatar src={jockey.photo} size={56} radius="xl" className="border-2 border-border" />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Text className="text-foreground font-semibold truncate">{jockey.name}</Text>
                            {hotStreak && (
                              <Badge
                                size="xs"
                                variant="light"
                                className={`${hotStreak.color} ${hotStreak.bg}`}
                                leftSection={<hotStreak.icon size={10} />}
                              >
                                {hotStreak.label}
                              </Badge>
                            )}
                          </div>
                          <Text size="xs" className="text-muted-foreground mb-2">
                            {jockey.nationality} • {jockey.age} years old
                          </Text>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Text className="text-primary font-bold">{jockey.seasonWins}</Text>
                              <Text size="xs" className="text-muted-foreground">
                                Season Wins
                              </Text>
                            </div>
                            <div>
                              <Text className="text-foreground font-bold">{jockey.strikeRate}%</Text>
                              <Text size="xs" className="text-muted-foreground">
                                Strike Rate
                              </Text>
                            </div>
                            <div>
                              <Text className="text-foreground font-bold">{jockey.groupOneWins}</Text>
                              <Text size="xs" className="text-muted-foreground">
                                G1 Wins
                              </Text>
                            </div>
                          </div>
                        </div>

                        {/* Arrow */}
                        <IconChevronRight
                          size={20}
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                        />
                      </div>

                      {/* Recent Form */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <Text size="xs" className="text-muted-foreground">
                            Last {jockey.recentForm.total} rides
                          </Text>
                          <Group gap="xs">
                            <Badge size="xs" variant="light" className="bg-primary/10 text-primary">
                              {jockey.recentForm.wins}W
                            </Badge>
                            <Badge size="xs" variant="light" className="bg-accent/10 text-accent">
                              {jockey.recentForm.places}P
                            </Badge>
                          </Group>
                        </div>
                        <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden bg-muted mt-2">
                          <div
                            className="bg-primary h-full transition-all"
                            style={{ width: `${(jockey.recentForm.wins / jockey.recentForm.total) * 100}%` }}
                          />
                          <div
                            className="bg-accent h-full transition-all"
                            style={{ width: `${(jockey.recentForm.places / jockey.recentForm.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </Paper>
                  </Link>
                )
              })}
            </SimpleGrid>
          )}
        </div>

        <Divider className="border-border mb-8" />

        <div>
          <Group gap="sm" className="mb-6">
            <ThemeIcon size="lg" radius="md" className="bg-accent/20 text-accent">
              <IconCalendar size={20} />
            </ThemeIcon>
            <Title order={3} className="text-foreground font-bold">
              Jockeys Running Today
            </Title>
            <Badge variant="light" className="bg-primary/10 text-primary">
              {Object.keys(jockeysRunningToday).length} Venues
            </Badge>
          </Group>

          <Accordion
            variant="separated"
            radius="lg"
            styles={{
              item: {
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              },
              control: {
                color: "hsl(var(--foreground))",
              },
              content: {
                backgroundColor: "hsl(var(--card))",
              },
              chevron: {
                color: "hsl(var(--muted-foreground))",
              },
            }}
          >
            {Object.entries(jockeysRunningToday).map(([venueId, jockeyList]) => {
              const venue = venuesList.find((v) => v.id === venueId)
              if (!venue) return null

              return (
                <Accordion.Item key={venueId} value={venueId}>
                  <Accordion.Control>
                    <Group justify="space-between" wrap="nowrap" className="pr-4">
                      <Group gap="md">
                        <ThemeIcon size="lg" radius="md" className="bg-primary/10 text-primary">
                          <IconMapPin size={18} />
                        </ThemeIcon>
                        <Stack gap={2}>
                          <Text className="text-foreground font-semibold">{venue.name}</Text>
                          <Text size="xs" className="text-muted-foreground">
                            {venue.location}, {venue.state} • {venue.trackCondition}
                          </Text>
                        </Stack>
                      </Group>
                      <Group gap="sm">
                        <Badge variant="light" className="bg-secondary text-muted-foreground">
                          {jockeyList.length} jockeys
                        </Badge>
                        <Badge variant="light" className="bg-primary/10 text-primary">
                          {venue.raceCount} races
                        </Badge>
                      </Group>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Table
                      striped
                      highlightOnHover
                      styles={{
                        table: { backgroundColor: "transparent" },
                        tr: { borderColor: "hsl(var(--border))" },
                        th: { color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" },
                        td: { color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" },
                      }}
                    >
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Jockey</Table.Th>
                          <Table.Th>Rides</Table.Th>
                          <Table.Th>First Ride</Table.Th>
                          <Table.Th>Mounts</Table.Th>
                          <Table.Th></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {jockeyList.map((jockey) => {
                          const jockeyId = getJockeyIdFromShortName(jockey.jockeyName)
                          const jockeyProfile = jockeyId ? jockeyProfiles[jockeyId] : null

                          return (
                            <Table.Tr key={jockey.jockeyName}>
                              <Table.Td>
                                <Group gap="sm">
                                  <Avatar
                                    src={jockeyProfile?.photo}
                                    size={32}
                                    radius="xl"
                                    className="border border-border"
                                  />
                                  <Stack gap={0}>
                                    <Text size="sm" className="text-foreground font-medium">
                                      {jockeyProfile?.name || jockey.jockeyName}
                                    </Text>
                                    {jockeyProfile && jockeyProfile.daysSinceLastWin <= 2 && (
                                      <Badge
                                        size="xs"
                                        variant="light"
                                        className="bg-primary/20 text-primary w-fit"
                                        leftSection={<IconFlame size={10} />}
                                      >
                                        Hot
                                      </Badge>
                                    )}
                                  </Stack>
                                </Group>
                              </Table.Td>
                              <Table.Td>
                                <Badge variant="light" className="bg-accent/10 text-accent">
                                  {jockey.rides} rides
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm" className="text-muted-foreground">
                                  {jockey.firstRide}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Group gap="xs" wrap="wrap">
                                  {jockey.mounts.slice(0, 4).map((mount) => (
                                    <Badge
                                      key={mount.race}
                                      size="xs"
                                      variant="light"
                                      className="bg-secondary text-muted-foreground"
                                      leftSection={<IconHorseToy size={10} />}
                                    >
                                      R{mount.race}:{" "}
                                      {mount.horse.length > 10 ? mount.horse.slice(0, 10) + "..." : mount.horse}
                                    </Badge>
                                  ))}
                                  {jockey.mounts.length > 4 && (
                                    <Badge size="xs" variant="light" className="bg-secondary text-muted-foreground">
                                      +{jockey.mounts.length - 4} more
                                    </Badge>
                                  )}
                                </Group>
                              </Table.Td>
                              <Table.Td>
                                {jockeyId && (
                                  <Link href={`/jockey/${jockeyId}`}>
                                    <Badge
                                      variant="light"
                                      className="bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                                      rightSection={<IconChevronRight size={12} />}
                                    >
                                      Profile
                                    </Badge>
                                  </Link>
                                )}
                              </Table.Td>
                            </Table.Tr>
                          )
                        })}
                      </Table.Tbody>
                    </Table>

                    {/* Quick venue link */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <Link href={`/venue/${venueId}`}>
                        <Badge
                          size="lg"
                          variant="light"
                          className="bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                          rightSection={<IconChevronRight size={14} />}
                        >
                          View all races at {venue.name}
                        </Badge>
                      </Link>
                    </div>
                  </Accordion.Panel>
                </Accordion.Item>
              )
            })}
          </Accordion>
        </div>
      </Container>
    </div>
  )
}
