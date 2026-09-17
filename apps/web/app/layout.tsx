import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import RNWRegistry from "./rnw-registry";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApiProvider } from "api";
import { ThemeProvider } from "ui/theme/themeProvider";
import { getNeuralPalette } from "ui/theme";
import "./globals.css";
import ToastProviders from "ui/components/toastMessage/ToastProviders";

const LIVE_DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL ??
  "https://react-native-next-theme-web.vercel.app";

export const metadata: Metadata = {
  title: "Project Management System",
  description:
    "Internal Project Management System (PMS) — projects, lifecycle, teams, contracts, milestones, timeline, finance, incentives, warranty, reports, and dashboard.",
  metadataBase: new URL(LIVE_DEMO_URL),
  openGraph: {
    title: "Project Management System",
    description:
      "Internal Project Management System (PMS) — projects, lifecycle, teams, contracts, milestones, timeline, finance, incentives, warranty, reports, and dashboard.",
    url: LIVE_DEMO_URL,
    siteName: "Monorepo Starter",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Monorepo starter preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Management System",
    description:
      "Internal Project Management System (PMS) — projects, lifecycle, teams, contracts, milestones, timeline, finance, incentives, warranty, reports, and dashboard.",
    images: ["/og-image.png"],
  },
};

let DevChunkRecovery: React.ComponentType | null = null;
if (process.env.NODE_ENV !== "production") {
  DevChunkRecovery = require("./chunk-recovery").default;
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverPalette = getNeuralPalette("dark");
  const neuralCssVars = Object.fromEntries(
    Object.entries(serverPalette).map(([key, value]) => [
      `--neural-${key}`,
      value,
    ]),
  ) as React.CSSProperties;

  return (
    <html
      lang="en"
      dir="ltr"
      className="bg-neural-canvas dark"
      style={neuralCssVars}
    >
      <body
        className={`${inter.variable} min-h-screen bg-neural-canvas text-neural-text`}
      >
        <RNWRegistry>
          <SafeAreaProvider>
            <ApiProvider>
              <ThemeProvider>
                <ToastProviders />
                {children}
              </ThemeProvider>
            </ApiProvider>
          </SafeAreaProvider>
        </RNWRegistry>
      </body>
    </html>
  );
}
