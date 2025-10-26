import fs from "fs";
import path from "path";
import { Container, Title, Grid, GridCol, Card, Text, Badge, Group } from "@mantine/core";

type Ride = {
  date: string;
  venue: string;
  raceTitle: string;
  horse: string;
  odds: number | null;
};

type Jockey = {
  jockeyName: string;
  daysSinceLastWin?: number | null;
  placeRate?: number;
  winRate?: number;
  rides: Ride[];
  bestOdds?: number;
};

/* ---------- Helpers ---------- */

function getTodayFolder() {
  const dateStr = new Date()
    .toLocaleDateString("en-AU", {
      timeZone: "Australia/Sydney",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");
  return dateStr;
}

function loadJson(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export default async function Home() {
  const today = getTodayFolder();
  const processedDir = path.join(process.cwd(), "data", "processed", today);
  const hotFormPath = path.join(processedDir, "hotForm.json");
  const dueForWinPath = path.join(processedDir, "dueForWin.json");

  const hotForm: Jockey[] = fs.existsSync(hotFormPath)
    ? loadJson(hotFormPath)
    : [];
  const dueForWin: Jockey[] = fs.existsSync(dueForWinPath)
    ? loadJson(dueForWinPath)
    : [];

  return (
    <Container py="xl">
      <Title order={1} mb="lg" ta="center">
        🏇 Jockey Performance Dashboard ({today})
      </Title>

      <Grid gutter="xl">
        {/* 🔥 Hot Form Section */}
        <GridCol span={{ base: 12, md: 6 }}>
          <Title order={2} mb="md">
            🔥 Hot Form Jockeys
          </Title>
          {hotForm.length === 0 ? (
            <Text c="dimmed">No hot-form jockeys found for today.</Text>
          ) : (
            hotForm.map((jockey) => (
              <Card
                key={jockey.jockeyName}
                shadow="sm"
                withBorder
                mb="sm"
                p="md"
                radius="md"
              >
                <Group justify="space-between" align="center">
                  <Text fw={700}>{jockey.jockeyName}</Text>
                  <Badge color="green" variant="filled">
                    {Math.round((jockey.winRate ?? 0) * 100)}% Win /{" "}
                    {Math.round((jockey.placeRate ?? 0) * 100)}% Plc
                  </Badge>
                </Group>

                <Text size="sm" mt="xs" c="dimmed">
                  {jockey.rides.length} ride
                  {jockey.rides.length > 1 ? "s" : ""} today
                </Text>

                {jockey.rides.slice(0, 2).map((r, i) => (
                  <Text key={i} size="sm" mt={4}>
                    • {r.horse} ({r.venue}, {r.raceTitle}) — Odds:{" "}
                    {r.odds ?? "-"}
                  </Text>
                ))}
              </Card>
            ))
          )}
        </GridCol>

        {/* 💤 Due for Win Section */}
        <GridCol span={{ base: 12, md: 6 }}>
          <Title order={2} mb="md">
            💤 Due for a Win
          </Title>
          {dueForWin.length === 0 ? (
            <Text c="dimmed">No due-for-win jockeys found for today.</Text>
          ) : (
            dueForWin.map((jockey) => (
              <Card
                key={jockey.jockeyName}
                shadow="sm"
                withBorder
                mb="sm"
                p="md"
                radius="md"
              >
                <Group justify="space-between" align="center">
                  <Text fw={700}>{jockey.jockeyName}</Text>
                  <Badge color="orange" variant="filled">
                    {jockey.daysSinceLastWin} days since win
                  </Badge>
                </Group>

                <Text size="sm" mt="xs" c="dimmed">
                  {jockey.rides.length} ride
                  {jockey.rides.length > 1 ? "s" : ""} today
                </Text>

                {jockey.rides.slice(0, 2).map((r, i) => (
                  <Text key={i} size="sm" mt={4}>
                    • {r.horse} ({r.venue}, {r.raceTitle}) — Odds:{" "}
                    {r.odds ?? "-"}
                  </Text>
                ))}
              </Card>
            ))
          )}
        </GridCol>
      </Grid>
    </Container>
  );
}