"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "ui/components/button";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { usePmsProjects } from "api";
import { PageShell } from "../../../components/pms/pageShell";
import {
  DashboardZone,
  KpiTilePlaceholder,
  ZonePlaceholder,
  type DashboardZoneConfig,
  type DashboardZoneState,
} from "../../../components/pms/dashboardZone";
import { EmptyState } from "../../../components/pms/states";

/**
 * SCR-01 — Management Dashboard (PM-002 scaffold).
 *
 * Purpose (spec §2.11): management-facing at-a-glance oversight of the state of
 * projects across the portfolio. Zones A–F per IA §5; every zone's KPI/widget set is
 * To be confirmed (IA-TBC-11), so each zone renders an explicit awaiting-confirmation
 * placeholder — no KPI figures are invented.
 */

const KPI_ZONE: DashboardZoneConfig = {
  zone: "B",
  title: "KPI summary row",
  description: "One stat card per KPI; the KPI set is to be confirmed.",
  tbcId: "IA-TBC-11",
};

const STATUS_ZONE: DashboardZoneConfig = {
  zone: "C",
  title: "Status overview",
  description:
    "Breakdown of projects by lifecycle status; the status list is to be confirmed.",
  tbcId: "IA-TBC-02",
};

const SCHEDULE_ZONE: DashboardZoneConfig = {
  zone: "D",
  title: "Schedule outlook",
  description:
    "Upcoming milestones / timeline signals; milestone and timeline definitions are to be confirmed.",
  tbcId: "IA-TBC-05, IA-TBC-06",
};

const FINANCE_ZONE: DashboardZoneConfig = {
  zone: "E",
  title: "Financial summary",
  description:
    "Budget vs. DEV cost / contract value aggregates; financial fields are to be confirmed.",
  tbcId: "IA-TBC-07",
};

const ATTENTION_ZONE: DashboardZoneConfig = {
  zone: "F",
  title: "Attention list",
  description:
    'Projects needing management attention; the definition of "attention" is not in the spec yet.',
  tbcId: "IA-TBC-11",
};

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = usePmsProjects();

  const state: DashboardZoneState = isLoading
    ? "loading"
    : isError
      ? "error"
      : "ready";
  const isEmpty = state === "ready" && (data ?? []).length === 0;

  return (
    <PageShell
      screenId="SCR-01"
      title="Dashboard"
      responsibility="Management-facing at-a-glance oversight of the state of projects across the portfolio — summaries only, not a data entry surface."
    >
      {/* Zone A: page header — title above; period/filter context is TBC. */}
      <Text className="mb-4 text-xs text-fg/50 dark:text-fg-dark/50">
        Zone A period/filter context — to be confirmed (IA-TBC-11).
      </Text>

      {isEmpty ? (
        <EmptyState
          title="No projects yet"
          message="The dashboard summarizes the state of projects across the portfolio. Add projects to see aggregates here."
          tbcId="IA-TBC-11"
          action={
            <Button
              label="Go to projects"
              onPress={() => router.push("/projects")}
              className="w-auto self-start"
            />
          }
        />
      ) : (
        <View className="gap-4">
          <DashboardZone config={KPI_ZONE} state={state} onRetry={refetch}>
            <View className="flex-row flex-wrap gap-3">
              <KpiTilePlaceholder tbcId="IA-TBC-11" />
              <KpiTilePlaceholder tbcId="IA-TBC-11" />
              <KpiTilePlaceholder tbcId="IA-TBC-11" />
            </View>
          </DashboardZone>

          <View className="flex-row flex-wrap gap-4">
            <DashboardZone
              config={STATUS_ZONE}
              state={state}
              onRetry={refetch}
              className="min-w-[300px] flex-1"
            >
              <ZonePlaceholder tbcId="IA-TBC-02" />
            </DashboardZone>
            <DashboardZone
              config={SCHEDULE_ZONE}
              state={state}
              onRetry={refetch}
              className="min-w-[300px] flex-1"
            >
              <ZonePlaceholder tbcId="IA-TBC-05, IA-TBC-06" />
            </DashboardZone>
          </View>

          <View className="flex-row flex-wrap gap-4">
            <DashboardZone
              config={FINANCE_ZONE}
              state={state}
              onRetry={refetch}
              className="min-w-[300px] flex-1"
            >
              <ZonePlaceholder tbcId="IA-TBC-07" />
            </DashboardZone>
            <DashboardZone
              config={ATTENTION_ZONE}
              state={state}
              onRetry={refetch}
              className="min-w-[300px] flex-1"
            >
              <ZonePlaceholder tbcId="IA-TBC-11" />
            </DashboardZone>
          </View>
        </View>
      )}
    </PageShell>
  );
}
