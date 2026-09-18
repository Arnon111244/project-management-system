"use client";
import React from "react";
import { Link } from "shared_mono_app/utils/router";
import { Button } from "ui/components/button";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { UniversalTable, type TableColumn } from "ui/components/table";
import { usePmsProjects, type PmsProjectRecord } from "api";
import { PageShell } from "../../../components/pms/pageShell";
import {
  EmptyState,
  ErrorState,
  StatusBadge,
} from "../../../components/pms/states";

/**
 * SCR-02 — Projects List (PM-002 scaffold).
 *
 * The entry point to the core entity: lists the organizational project records with
 * their lifecycle status and leads to each project's detail (SCR-03). Readable-table
 * pattern (CLAUDE.md §4) via UniversalTable. The confirmed column set, identifying
 * fields, status values, sorting/filtering, row selection, and page size are all TBC
 * (IA-TBC-01/02/16, SCR-TBC-02) — the table below shows provisional demo records.
 */

const COLUMNS: TableColumn<PmsProjectRecord>[] = [
  {
    Header: "Code",
    accessor: "code",
    minWidth: 100,
  },
  {
    Header: "Project name",
    accessor: "name",
    minWidth: 200,
    Cell: ({ row }) => (
      <Link
        href={`/projects/${row.projectId}`}
        className="text-sm text-brand hover:underline"
      >
        {row.name}
      </Link>
    ),
  },
  {
    Header: "Lifecycle status",
    accessor: "lifecycleStatus",
    minWidth: 140,
    Cell: ({ row }) => <StatusBadge label={row.lifecycleStatus} />,
  },
];

export default function ProjectsPage() {
  const { data, isLoading, isError, refetch } = usePmsProjects();
  const projects = data ?? [];

  return (
    <PageShell
      screenId="SCR-02"
      title="Projects"
      breadcrumbs={[{ label: "Projects" }]}
      responsibility="The entry point to the core entity — lists the organizational project records with their lifecycle status and leads to each project's detail (SCR-03)."
      action={
        // Creation rights are TBC (IA-TBC-01) — the primary action stays reserved
        // but disabled until confirmed (SCR-TBC-17).
        <Button
          label="New project"
          disabled
          accessibilityLabel="New project (creation rights to be confirmed)"
          className="w-auto self-start"
        />
      }
    >
      {isLoading ? (
        <UniversalTable columns={COLUMNS} data={[]} loading hideFilter />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          message="No project records exist yet. Once projects are created they appear here as a list with their lifecycle status."
          tbcId="IA-TBC-01"
        />
      ) : (
        <View>
          <UniversalTable columns={COLUMNS} data={projects} hideFilter />
          <Text className="mt-3 text-xs text-fg/50 dark:text-fg-dark/50">
            Provisional demo data — the confirmed column set, identifying
            fields, status values, and creation rights are to be confirmed
            (IA-TBC-01, IA-TBC-02, IA-TBC-16). Row navigation via the project
            name (SCR-03).
          </Text>
        </View>
      )}
    </PageShell>
  );
}
