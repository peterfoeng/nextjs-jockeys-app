"use client";

import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBell, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./header.module.css";

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const pathname = usePathname();

  const isVenuesActive =
    pathname === "/venues" ||
    pathname === "/" ||
    pathname.startsWith("/venue/");
  const isResultsActive = pathname === "/results";
  const isJockeysActive = pathname.startsWith("/jockey");

  return (
    <>
      <Box component="header" className={classes.header}>
        <Container size="xl" py="md">
          <Group justify="space-between">
            <Link href="/venues" className={classes.logoContainer}>
              <Group gap="sm">
                <Box className={classes.logoIcon}>
                  <Box component="span" className={classes.logoEmoji}>
                    🏇
                  </Box>
                </Box>
                <div>
                  <Title order={4} fw={700}>
                    RacingHub
                  </Title>
                  <Text size="xs" c="dimmed">
                    Live Racing
                  </Text>
                </div>
              </Group>
            </Link>

            <Group gap="md" visibleFrom="sm">
              <Button
                component={Link}
                href="/venues"
                variant="subtle"
                c={isVenuesActive ? "var(--mantine-color-text)" : "dimmed"}
              >
                Today{"'"}s Races
              </Button>
              <Button
                component={Link}
                href="/results"
                variant="subtle"
                c={isResultsActive ? "var(--mantine-color-text)" : "dimmed"}
              >
                Results
              </Button>
              <Button
                component={Link}
                href="/jockeys"
                variant="subtle"
                c={isJockeysActive ? "var(--mantine-color-text)" : "dimmed"}
              >
                Jockeys
              </Button>
              <Button variant="subtle" c="dimmed">
                Form Guide
              </Button>
            </Group>

            <Group gap="xs">
              <ActionIcon variant="subtle" size="lg" c="dimmed">
                <IconBell size={20} />
              </ActionIcon>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="lg" c="dimmed">
                    <IconUser size={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconUser size={14} />}>
                    Profile
                  </Menu.Item>
                  <Menu.Item leftSection={<IconSettings size={14} />}>
                    Settings
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                hiddenFrom="sm"
                size="sm"
                color="white"
              />
            </Group>
          </Group>
        </Container>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000}
      >
        <Stack>
          <Button
            component={Link}
            href="/venues"
            variant="subtle"
            fullWidth
            justify="flex-start"
            c={isVenuesActive ? "var(--mantine-color-text)" : "dimmed"}
            onClick={closeDrawer}
          >
            Today{"'"}s Races
          </Button>
          <Button
            component={Link}
            href="/results"
            variant="subtle"
            fullWidth
            justify="flex-start"
            c={isResultsActive ? "var(--mantine-color-text)" : "dimmed"}
            onClick={closeDrawer}
          >
            Results
          </Button>
          <Button
            component={Link}
            href="/jockeys"
            variant="subtle"
            fullWidth
            justify="flex-start"
            c={isJockeysActive ? "var(--mantine-color-text)" : "dimmed"}
            onClick={closeDrawer}
          >
            Jockeys
          </Button>
          <Button variant="subtle" fullWidth justify="flex-start" c="dimmed">
            Form Guide
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
