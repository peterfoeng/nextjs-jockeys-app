"use client";

import {
  AppShell,
  Box,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo } from "react";
import type { RaceNavigationNode } from "@/lib/raceData";
import { formatIsoDate } from "@/lib/raceData";

interface SiteShellProps {
  navigation: RaceNavigationNode[];
  children: ReactNode;
}

export function SiteShell({ navigation, children }: SiteShellProps) {
  const pathname = usePathname();

  const navLinks = useMemo(
    () =>
      navigation.map((node) => {
        const datePathPrefix = `/races/${node.date}`;
        const isDateActive = pathname.startsWith(datePathPrefix);
        return (
          <NavLink
            key={node.date}
            label={formatIsoDate(node.date)}
            defaultOpened={isDateActive}
          >
            {node.venues.map((venue) => {
              const href = `${datePathPrefix}/${venue.slug}`;
              const isActive = pathname === href;
              return (
                <NavLink
                  key={venue.slug}
                  label={venue.name}
                  component={Link}
                  href={href}
                  active={isActive}
                />
              );
            })}
          </NavLink>
        );
      }),
    [navigation, pathname],
  );

  return (
    <AppShell navbar={{ width: 300, breakpoint: "sm" }} padding="lg">
      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Title order={3}>Race Day Dashboard</Title>
          <Text c="dimmed" size="sm">
            Navigate through today&apos;s meetings
          </Text>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} mt="md">
          <Stack gap="xs">
            <NavLink
              label="Home"
              component={Link}
              href="/"
              active={pathname === "/"}
            />
            <NavLink label="Races" opened>
              <Stack gap={0}>{navLinks}</Stack>
            </NavLink>
            <NavLink
              label="Jockeys"
              component={Link}
              href="/jockeys"
              active={pathname === "/jockeys"}
            />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main bg="var(--mantine-color-dark-7)">
        <Box component="main" maw={1200} mx="auto" w="100%">
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
