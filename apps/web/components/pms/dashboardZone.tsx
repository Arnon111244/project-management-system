"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/components/card";
import { Button } from "ui/components/button";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { AwaitingConfirmation, SkeletonBlock } from "./states";

/**
 * Management dashboard zones (SCR-01, IA §5, PM-002). Every zone's KPI/widget set is
 * To be confirmed (IA-TBC-11), so each zone renders an explicit awaiting-confirmation
 * placeholder in the Card structure the confirmed dashboard will use. Per-zone error
 * cards keep one failed widget from blanking the dashboard (screen-specification §3
 * SCR-01 states).
 */

export type DashboardZoneState = "loading" | "error" | "ready";

export type DashboardZoneConfig = {
  zone: string;
  title: string;
  description: string;
  tbcId: string;
};

export function DashboardZone({
  config,
  state,
  onRetry,
  children,
  className,
}: {
  config: DashboardZoneConfig;
  state: DashboardZoneState;
  onRetry: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="items-start">
        <View className="flex-row items-center gap-2">
          <Text className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-fg/60 dark:bg-white/10 dark:text-fg-dark/60">
            Zone {config.zone}
          </Text>
          <CardTitle className="text-base">{config.title}</CardTitle>
        </View>
        <CardDescription className="text-left">
          {config.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state === "loading" ? (
          <View className="gap-3">
            <SkeletonBlock className="h-5 w-48" />
            <SkeletonBlock className="h-16 w-full" />
          </View>
        ) : state === "error" ? (
          <View className="gap-3">
            <Text className="text-sm text-danger">
              The data for this zone could not be loaded. Please try again.
            </Text>
            <Button
              label="Retry"
              onPress={onRetry}
              className="w-auto self-start"
            />
          </View>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

/** Standard awaiting-confirmation placeholder for a zone's TBC content. */
export function ZonePlaceholder({ tbcId }: { tbcId: string }) {
  return (
    <AwaitingConfirmation
      label="Awaiting confirmation — content not yet defined"
      tbcId={tbcId}
    />
  );
}

/**
 * Zone B (KPI summary row) placeholder tile — shaped like the existing
 * `StatsDashboard` (`StatsCards`) pattern but without invented KPI values.
 */
export function KpiTilePlaceholder({ tbcId }: { tbcId: string }) {
  return (
    <View className="min-w-[220px] flex-1 rounded-2xl border border-border px-5 py-4 dark:border-border-dark">
      <Text className="text-xs font-semibold uppercase tracking-wider text-fg/50 dark:text-fg-dark/50">
        KPI
      </Text>
      <Text className="mt-2 text-lg font-semibold text-fg/40 dark:text-fg-dark/40">
        —
      </Text>
      <Text className="mt-1 text-xs text-fg/50 dark:text-fg-dark/50">
        Awaiting confirmation ({tbcId})
      </Text>
    </View>
  );
}
