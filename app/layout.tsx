import { ColorSchemeScript } from "@mantine/core";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/SiteShell";
import { getRaceNavigationTree } from "@/lib/raceData";
import { AppProviders } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Race Day Dashboard",
  description: "Daily racing overview with venues and jockey insights",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const navigation = await getRaceNavigationTree();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProviders>
          <SiteShell navigation={navigation}>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
