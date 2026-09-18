"use client";
import React from "react";
import { useRouter } from "next/navigation";
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
 * SCR-02 — Projects List (PM-003).
 *
 * The entry point to the core entity: lists the organizational project records with
 * their lifecycle status and leads to each project's detail (SCR-03). Readable-table
 * pattern (CLAUDE.md §4) via UniversalTable. The column set follows the IA §6
 * per-column table — every column whose underlying module is unconfirmed is marked
 * "(TBC)" with its IA TBC reference, and the values are provisional demo data.
 * Sorting, filter dimensions, row selection, and page size are TBC (IA-TBC-16).
 */

/** Table row = mock record + the `id` key UniversalTable uses for row identity. */
type ProjectRow = PmsProjectRecord & { id: string };

const COLUMNS: TableColumn<ProjectRow>[] = [
  {
    // Identifying fields TBC (IA-TBC-01, IA §6).
    Header: "Project code (TBC)",
    accessor: "code",
    minWidth: 150,
  },
  {
    // Identifying fields TBC (IA-TBC-01, IA §6).
    Header: "Project name (TBC)",
    accessor: "name",
    minWidth: 210,
    Cell: ({ row }) => (
      <Link
        href={`/projects/${row.projectId}`}
        className="text-sm text-brand hover:underline"
        // Row press already navigates (single-select callback below); keep the
        // link's own click from bubbling to the row so navigation fires once.
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
          event.stopPropagation()
        }
      >
        {row.name}
      </Link>
    ),
  },
  {
    // Status concept confirmed; displayed values TBC (IA-TBC-02, IA §6).
    Header: "Lifecycle status (values TBC)",
    accessor: "lifecycleStatus",
    minWidth: 170,
    Cell: ({ row }) => <StatusBadge label={row.lifecycleStatus} />,
  },
  {
    // One-PM rule TBC (IA-TBC-03, IA §6).
    Header: "Project manager (TBC)",
    accessor: "projectManager",
    minWidth: 160,
    Cell: ({ row }) => <ProvisionalCellText value={row.projectManager} />,
  },
  {
    // Contract fields TBC (IA-TBC-04, IA §6).
    Header: "Contract value (TBC)",
    accessor: "contractValue",
    minWidth: 150,
    Cell: ({ row }) => <ProvisionalCellText value={row.contractValue} />,
  },
  {
    // Planned/actual dates TBC (IA-TBC-06, IA §6).
    Header: "Timeline start–end (TBC)",
    accessor: "plannedStart",
    minWidth: 210,
    Cell: ({ row }) => (
      <ProvisionalCellText
        value={
          row.plannedStart || row.plannedEnd
            ? `${row.plannedStart ?? "—"} – ${row.plannedEnd ?? "—"}`
            : null
        }
      />
    ),
  },
  {
    // Financial fields and currency TBC (IA-TBC-07, IA §6).
    Header: "Budget / DEV cost (TBC)",
    accessor: "budget",
    minWidth: 180,
    Cell: ({ row }) => (
      <ProvisionalCellText
        value={
          row.budget || row.devCost
            ? `${row.budget ?? "—"} / ${row.devCost ?? "—"}`
            : null
        }
      />
    ),
  },
];

/** Cell text for a provisional field that may be unset ("—" until confirmed). */
function ProvisionalCellText({ value }: { value: string | null }) {
  return (
    <Text className="text-sm text-fg/80 dark:text-fg-dark/80">
      {value ?? "—"}
    </Text>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = usePmsProjects();
  const projects = data ?? [];
  const rows: ProjectRow[] = projects.map((project) => ({
    ...project,
    id: project.projectId,
  }));

  /**
   * Row click → SCR-03 (IA §6). UniversalTable surfaces row presses through its
   * single-select callback, so a row press selects the row and navigation follows
   * the selection; the project name stays a direct link as well.
   */
  const handleRowActivate = (selected: ProjectRow[]) => {
    const row = selected[0];
    if (row) router.push(`/projects/${row.projectId}`);
  };

  return (
    <PageShell
      screenId="SCR-02"
      title="Projects"
      breadcrumbs={[{ label: "Projects" }]}
      responsibility="The entry point to the core entity — lists the organizational project records with their lifecycle status and leads to each project's detail (SCR-03)."
      action={
        // Creation rights are TBC (IA-TBC-01) — the create-project form shell is
        // the provisional PM-003 entry point writing to the mock store only.
        <Button
          label="New project"
          onPress={() => router.push("/projects/new")}
          className="w-auto self-start"
        />
      }
    >
      {isLoading ? (
        <UniversalTable columns={COLUMNS} data={[]} loading hideFilter />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No projects yet"
          message="No project records exist yet. Create the first project to see it listed here with its lifecycle status."
          tbcId="IA-TBC-01"
          action={
            <Button
              label="New project"
              onPress={() => router.push("/projects/new")}
              className="w-auto"
            />
          }
        />
      ) : (
        <View>
          <UniversalTable
            columns={COLUMNS}
            data={rows}
            hideFilter
            allowSingleSelect
            onSelectionChange={handleRowActivate}
          />
          <Text className="mt-3 text-xs text-fg/50 dark:text-fg-dark/50">
            Provisional demo data — column set and per-column status follow IA
            §6: identifying fields (IA-TBC-01), status values (IA-TBC-02),
            project manager (IA-TBC-03), contract value (IA-TBC-04), timeline
            dates (IA-TBC-06), budget/DEV cost (IA-TBC-07). Sorting, filters,
            row selection, and page size are to be confirmed (IA-TBC-16). Row
            click opens the project detail (SCR-03).
          </Text>
        </View>
      )}
    </PageShell>
  );
}
