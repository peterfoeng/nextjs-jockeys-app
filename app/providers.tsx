"use client";

import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark" withCssVariables>
      {children}
    </MantineProvider>
  );
}
