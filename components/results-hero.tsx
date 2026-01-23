import {
  Badge,
  Box,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendar, IconMapPin, IconTrophy } from "@tabler/icons-react";

interface ResultsHeroProps {
  totalVenues: number;
  totalRaces: number;
  date: string;
}

export function ResultsHero({
  totalVenues,
  totalRaces,
  date,
}: ResultsHeroProps) {
  return (
    <Box
      py={64}
      style={{
        background:
          "linear-gradient(to bottom, var(--mantine-color-default-hover), var(--mantine-color-body))",
        borderBottom: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Container size="xl">
        <Stack gap="xl">
          <Box>
            <Group gap="sm" mb="xs">
              <Badge size="lg" color="blue">
                Official Results
              </Badge>
            </Group>
            <Title
              order={1}
              size={{ base: "32px", md: "40px" }}
              fw={700}
              mb="xs"
            >
              Race Results
            </Title>
            <Text size="lg" c="dimmed">
              Full results, dividends, and sectional times from today{"'"}s
              racing
            </Text>
          </Box>

          <Group gap="md" wrap="wrap">
            <Paper withBorder px="md" py="sm">
              <Group gap="sm">
                <IconCalendar
                  size={20}
                  color="var(--mantine-color-blue-filled)"
                />
                <Box>
                  <Text size="xs" c="dimmed">
                    Date
                  </Text>
                  <Text fw={600}>{date}</Text>
                </Box>
              </Group>
            </Paper>
            <Paper withBorder px="md" py="sm">
              <Group gap="sm">
                <IconMapPin
                  size={20}
                  color="var(--mantine-color-blue-filled)"
                />
                <Box>
                  <Text size="xs" c="dimmed">
                    Venues
                  </Text>
                  <Text fw={600}>{totalVenues} Tracks</Text>
                </Box>
              </Group>
            </Paper>
            <Paper withBorder px="md" py="sm">
              <Group gap="sm">
                <IconTrophy
                  size={20}
                  color="var(--mantine-color-cyan-filled)"
                />
                <Box>
                  <Text size="xs" c="dimmed">
                    Completed Races
                  </Text>
                  <Text fw={600}>{totalRaces} Races</Text>
                </Box>
              </Group>
            </Paper>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
