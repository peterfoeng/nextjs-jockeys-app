"use client";
import {
  Avatar,
  Badge,
  Group,
  Paper,
  RingProgress,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconBolt,
  IconCloud,
  IconCloudRain,
  IconDroplet,
  IconFlame,
  IconMinus,
  IconRoute,
  IconSun,
  IconTarget,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  calculateEdgeBg,
  calculateEdgeColor,
  distanceSpecialists,
  type EdgeAnalysis,
  headToHeadData,
  todaysEdges,
  trackConditionStats,
} from "@/lib/edge-finder-data";

function EdgeCard({ edge }: { edge: EdgeAnalysis }) {
  const edgeColor = calculateEdgeColor(edge.edgeScore);
  const edgeBg = calculateEdgeBg(edge.edgeScore);

  return (
    <Paper
      withBorder
      radius="xl"
      p="lg"
      style={{ transition: "border-color 0.2s" }}
    >
      {/* Header */}
      <Group justify="space-between" align="flex-start" mb="md">
        <Link
          href={`/jockey/${edge.jockeyId}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          <Avatar
            src={edge.photo}
            size={48}
            radius="xl"
            style={{
              border: "2px solid var(--mantine-color-default-border)",
              transition: "border-color 0.2s",
            }}
          />
          <Box>
            <Text fw={600} style={{ transition: "color 0.2s" }}>
              {edge.jockeyName}
            </Text>
            <Text size="xs" c="dimmed">
              {edge.venue} - Race {edge.race}
            </Text>
          </Box>
        </Link>

        <Box ta="right">
          <Text size="32px" fw={700} c={edgeColor.replace("text-", "")}>
            {edge.edgeScore}
          </Text>
          <Text size="xs" c="dimmed">
            Edge Score
          </Text>
        </Box>
      </Group>

      {/* Horse & Odds */}
      <Group
        justify="space-between"
        p="sm"
        bg="var(--mantine-color-default-hover)"
        style={{ borderRadius: "var(--mantine-radius-lg)" }}
        mb="md"
      >
        <Box>
          <Text size="sm" c="dimmed">
            Mount
          </Text>
          <Text fw={600}>{edge.horse}</Text>
        </Box>
        <Box ta="right">
          <Text size="sm" c="dimmed">
            Odds
          </Text>
          <Text c="blue" fw={700} size="lg">
            {edge.odds}
          </Text>
        </Box>
      </Group>

      {/* Edge Factors */}
      <Stack gap="xs" mb="md">
        {edge.edgeFactors.map((factor, idx) => (
          <Group key={idx} align="flex-start" gap="xs">
            <ThemeIcon
              size="sm"
              radius="xl"
              color={
                factor.impact === "positive"
                  ? "blue"
                  : factor.impact === "negative"
                    ? "red"
                    : "gray"
              }
              variant="light"
            >
              {factor.impact === "positive" ? (
                <IconArrowUpRight size={12} />
              ) : factor.impact === "negative" ? (
                <IconArrowDownRight size={12} />
              ) : (
                <IconMinus size={12} />
              )}
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              <Group gap="xs">
                <Text size="sm" fw={500}>
                  {factor.factor}:
                </Text>
                <Badge size="xs" variant="light" c="dimmed">
                  {factor.value}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                {factor.description}
              </Text>
            </Box>
          </Group>
        ))}
      </Stack>

      {/* Value Analysis */}
      <Box
        style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
        pt="md"
      >
        <Grid gutter="sm" ta="center" mb="sm">
          <Grid.Col span={4}>
            <Tooltip label="Probability implied by the odds">
              <Box>
                <Text c="dimmed" fw={500}>
                  {edge.impliedProbability.toFixed(1)}%
                </Text>
                <Text size="xs" c="dimmed">
                  Implied Prob
                </Text>
              </Box>
            </Tooltip>
          </Grid.Col>
          <Grid.Col span={4}>
            <Tooltip label="Our estimated true probability based on stats">
              <Box>
                <Text c="blue" fw={700}>
                  {edge.trueEstimatedProbability.toFixed(1)}%
                </Text>
                <Text size="xs" c="dimmed">
                  True Est Prob
                </Text>
              </Box>
            </Tooltip>
          </Grid.Col>
          <Grid.Col span={4}>
            <Tooltip label="Expected value - positive means value bet">
              <Box>
                <Text
                  c={edge.expectedValue > 0 ? "blue" : "red"}
                  fw={edge.expectedValue > 0 ? 700 : 500}
                >
                  {edge.expectedValue > 0 ? "+" : ""}
                  {(edge.expectedValue * 100).toFixed(0)}%
                </Text>
                <Text size="xs" c="dimmed">
                  Expected Value
                </Text>
              </Box>
            </Tooltip>
          </Grid.Col>
        </Grid>

        <Group justify="space-between" mt="sm">
          <Badge
            size="sm"
            variant="light"
            color={
              edge.confidenceLevel === "high"
                ? "blue"
                : edge.confidenceLevel === "medium"
                  ? "cyan"
                  : "gray"
            }
          >
            {edge.confidenceLevel.charAt(0).toUpperCase() +
              edge.confidenceLevel.slice(1)}{" "}
            Confidence
          </Badge>
          <Badge
            size="sm"
            variant="light"
            color={edgeColor.replace("text-", "")}
            leftSection={
              edge.edgeType === "multi" ? (
                <IconBolt size={10} />
              ) : edge.edgeType === "conditions" ? (
                <IconCloud size={10} />
              ) : edge.edgeType === "venue" ? (
                <IconTarget size={10} />
              ) : edge.edgeType === "trainer" ? (
                <IconUsers size={10} />
              ) : edge.edgeType === "distance" ? (
                <IconRoute size={10} />
              ) : (
                <IconFlame size={10} />
              )
            }
          >
            {edge.edgeType === "multi"
              ? "Multiple Edges"
              : edge.edgeType.charAt(0).toUpperCase() + edge.edgeType.slice(1)}
          </Badge>
        </Group>
      </Box>
    </Paper>
  );
}

function HeadToHeadSection() {
  return (
    <div className="space-y-4">
      <Text className="text-muted-foreground mb-4">
        Compare head-to-head records between jockeys racing at the same venues
        today
      </Text>

      <div className="space-y-4">
        {headToHeadData.map((h2h, idx) => {
          const total = h2h.jockey1.wins + h2h.jockey2.wins;
          const j1Pct = (h2h.jockey1.wins / total) * 100;
          const j2Pct = (h2h.jockey2.wins / total) * 100;

          return (
            <Paper
              key={idx}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                {/* Jockey 1 */}
                <Link
                  href={`/jockey/${h2h.jockey1.id}`}
                  className="flex items-center gap-3 group flex-1"
                >
                  <Avatar
                    src={h2h.jockey1.photo}
                    size={56}
                    radius="xl"
                    className="border-2 border-primary/50 group-hover:border-primary transition-colors"
                  />
                  <div>
                    <Text className="text-foreground font-semibold group-hover:text-primary transition-colors">
                      {h2h.jockey1.name}
                    </Text>
                    <Text className="text-primary font-bold text-xl">
                      {h2h.jockey1.wins} wins
                    </Text>
                  </div>
                </Link>

                {/* VS */}
                <div className="px-6 text-center">
                  <Text className="text-muted-foreground font-bold text-lg">
                    VS
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    {h2h.totalRaces} races
                  </Text>
                </div>

                {/* Jockey 2 */}
                <Link
                  href={`/jockey/${h2h.jockey2.id}`}
                  className="flex items-center gap-3 group flex-1 justify-end"
                >
                  <div className="text-right">
                    <Text className="text-foreground font-semibold group-hover:text-primary transition-colors">
                      {h2h.jockey2.name}
                    </Text>
                    <Text className="text-accent font-bold text-xl">
                      {h2h.jockey2.wins} wins
                    </Text>
                  </div>
                  <Avatar
                    src={h2h.jockey2.photo}
                    size={56}
                    radius="xl"
                    className="border-2 border-accent/50 group-hover:border-accent transition-colors"
                  />
                </Link>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${j1Pct}%` }}
                  />
                  <div
                    className="bg-accent h-full transition-all"
                    style={{ width: `${j2Pct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <Text size="xs" className="text-primary font-medium">
                    {j1Pct.toFixed(1)}%
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    Last: {h2h.lastWinner} ({h2h.lastMeeting})
                  </Text>
                  <Text size="xs" className="text-accent font-medium">
                    {j2Pct.toFixed(1)}%
                  </Text>
                </div>
              </div>
            </Paper>
          );
        })}
      </div>
    </div>
  );
}

function TrackConditionsSection() {
  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "firm":
        return <IconSun size={16} />;
      case "good":
        return <IconCloud size={16} />;
      case "soft":
        return <IconDroplet size={16} />;
      case "heavy":
        return <IconCloudRain size={16} />;
      default:
        return <IconCloud size={16} />;
    }
  };

  const getRoiColor = (roi: number) => {
    if (roi >= 1.1) return "text-primary";
    if (roi >= 1.0) return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <div>
      <Text className="text-muted-foreground mb-4">
        See which jockeys excel under specific track conditions - crucial for
        today{"'"}s picks
      </Text>

      <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <Table.Thead>
            <Table.Tr className="border-border">
              <Table.Th className="text-muted-foreground">Jockey</Table.Th>
              <Table.Th className="text-center">
                <Group gap="xs" justify="center">
                  <IconSun size={14} className="text-yellow-500" />
                  <span className="text-muted-foreground">Firm</span>
                </Group>
              </Table.Th>
              <Table.Th className="text-center">
                <Group gap="xs" justify="center">
                  <IconCloud size={14} className="text-blue-400" />
                  <span className="text-muted-foreground">Good</span>
                </Group>
              </Table.Th>
              <Table.Th className="text-center">
                <Group gap="xs" justify="center">
                  <IconDroplet size={14} className="text-cyan-400" />
                  <span className="text-muted-foreground">Soft</span>
                </Group>
              </Table.Th>
              <Table.Th className="text-center">
                <Group gap="xs" justify="center">
                  <IconCloudRain size={14} className="text-indigo-400" />
                  <span className="text-muted-foreground">Heavy</span>
                </Group>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {trackConditionStats.map((stat) => (
              <Table.Tr
                key={stat.jockeyId}
                className="border-border hover:bg-secondary/30"
              >
                <Table.Td>
                  <Link href={`/jockey/${stat.jockeyId}`}>
                    <Group gap="sm" className="hover:opacity-80">
                      <Avatar src={stat.photo} size={36} radius="xl" />
                      <Text className="text-foreground font-medium">
                        {stat.jockeyName}
                      </Text>
                    </Group>
                  </Link>
                </Table.Td>
                {(["firm", "good", "soft", "heavy"] as const).map(
                  (condition) => {
                    const data = stat[condition];
                    const isHighest =
                      Math.max(
                        stat.firm.winRate,
                        stat.good.winRate,
                        stat.soft.winRate,
                        stat.heavy.winRate,
                      ) === data.winRate;

                    return (
                      <Table.Td key={condition} className="text-center">
                        <Stack gap={2}>
                          <Text
                            className={`font-bold ${isHighest ? "text-primary" : "text-foreground"}`}
                          >
                            {data.winRate}%
                          </Text>
                          <Text size="xs" className={getRoiColor(data.roi)}>
                            ROI: {data.roi.toFixed(2)}x
                          </Text>
                          <Text size="xs" className="text-muted-foreground">
                            {data.starts} starts
                          </Text>
                        </Stack>
                      </Table.Td>
                    );
                  },
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}

function DistanceSpecialistsSection() {
  return (
    <div>
      <Text className="text-muted-foreground mb-4">
        Identify jockeys who excel at specific distance brackets for targeted
        betting
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {distanceSpecialists.map((spec) => (
          <Paper
            key={spec.jockeyId}
            className="bg-card border border-border rounded-xl p-5"
          >
            <Link
              href={`/jockey/${spec.jockeyId}`}
              className="flex items-center gap-4 group"
            >
              <div className="relative">
                <Avatar
                  src={spec.photo}
                  size={64}
                  radius="xl"
                  className="border-2 border-border group-hover:border-primary/50 transition-colors"
                />
                <div className="absolute -bottom-1 -right-1">
                  <RingProgress
                    size={32}
                    thickness={3}
                    sections={[
                      { value: spec.winRate * 3, color: "hsl(var(--primary))" },
                    ]}
                    rootColor="hsl(var(--muted))"
                  />
                </div>
              </div>

              <div className="flex-1">
                <Text className="text-foreground font-semibold group-hover:text-primary transition-colors">
                  {spec.jockeyName}
                </Text>
                <Badge
                  size="sm"
                  variant="light"
                  className="bg-primary/10 text-primary mt-1"
                  leftSection={<IconRoute size={10} />}
                >
                  {spec.distance}
                </Badge>
              </div>
            </Link>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border text-center">
              <div>
                <Text className="text-primary font-bold">{spec.winRate}%</Text>
                <Text size="xs" className="text-muted-foreground">
                  Win Rate
                </Text>
              </div>
              <div>
                <Text className="text-foreground font-medium">
                  {spec.placeRate}%
                </Text>
                <Text size="xs" className="text-muted-foreground">
                  Place Rate
                </Text>
              </div>
              <div>
                <Text className="text-accent font-medium">
                  {spec.avgMargin}
                </Text>
                <Text size="xs" className="text-muted-foreground">
                  Avg Margin
                </Text>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <Text size="xs" className="text-muted-foreground">
                Best result:
              </Text>
              <Text size="sm" className="text-foreground">
                {spec.bestResult}
              </Text>
            </div>
          </Paper>
        ))}
      </SimpleGrid>
    </div>
  );
}

export function EdgeFinder() {
  const sortedEdges = [...todaysEdges].sort(
    (a, b) => b.edgeScore - a.edgeScore,
  );
  const topEdges = sortedEdges.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Group gap="md">
          <ThemeIcon
            size="xl"
            radius="md"
            className="bg-primary/20 text-primary"
          >
            <IconBolt size={24} />
          </ThemeIcon>
          <div>
            <Title order={2} className="text-foreground font-bold">
              Jockey Edge Finder
            </Title>
            <Text className="text-muted-foreground">
              AI-powered analysis to find value picks based on jockey statistics
            </Text>
          </div>
        </Group>
        <Badge
          size="lg"
          variant="light"
          className="bg-primary/10 text-primary"
          leftSection={<IconTarget size={14} />}
        >
          {topEdges.length} Value Picks Today
        </Badge>
      </div>

      {/* Tabs for different analysis types */}
      <Tabs
        defaultValue="edges"
        styles={{
          root: { backgroundColor: "transparent" },
          list: { borderColor: "hsl(var(--border))" },
          tab: {
            color: "hsl(var(--muted-foreground))",
            "&[data-active]": {
              color: "hsl(var(--primary))",
              borderColor: "hsl(var(--primary))",
            },
          },
          panel: { paddingTop: "1rem" },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="edges" leftSection={<IconBolt size={16} />}>
            Top Edges
          </Tabs.Tab>
          <Tabs.Tab value="h2h" leftSection={<IconUsers size={16} />}>
            Head to Head
          </Tabs.Tab>
          <Tabs.Tab value="conditions" leftSection={<IconCloud size={16} />}>
            Track Conditions
          </Tabs.Tab>
          <Tabs.Tab value="distance" leftSection={<IconRoute size={16} />}>
            Distance Specialists
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="edges">
          <SimpleGrid
            cols={{ base: 1, md: 2, xl: 3 }}
            spacing="lg"
            className="mt-4"
          >
            {topEdges.map((edge) => (
              <EdgeCard key={`${edge.jockeyId}-${edge.race}`} edge={edge} />
            ))}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="h2h">
          <HeadToHeadSection />
        </Tabs.Panel>

        <Tabs.Panel value="conditions">
          <TrackConditionsSection />
        </Tabs.Panel>

        <Tabs.Panel value="distance">
          <DistanceSpecialistsSection />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
