"use client";
import React, { createContext, useContext } from "react";
import { Pressable } from "react-native";
import { usePathname, useRouter } from "next/navigation";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/components/card";
import { Button } from "ui/components/button";
import { cn } from "ui/utils/cn";
import { usePmsProject, type PmsProjectRecord } from "api";
import { EmptyState, SkeletonBlock, StatusBadge } from "./states";
import { Breadcrumbs } from "./pageShell";
import {
  getProjectDetailTab,
  PROJECT_DETAIL_TABS,
  type ProjectDetailTab,
} from "../../lib/pms/navigation";

/**
 * Project detail (SCR-03 container + SCR-04…SCR-12 tabs, PM-002).
 *
 * The container hosts one project's header (identity + lifecycle status badge —
 * fields/values TBC, IA-TBC-01/IA-TBC-02) and the secondary tab navigation (IA §4.2,
 * proposed order, IA-TBC-17). It holds no data content of its own beyond the header;
 * the active tab's content is provided by the child route (SCR-04…SCR-12).
 */

type ProjectDetailValue = {
  project: PmsProjectRecord;
};

const ProjectDetailContext = createContext<ProjectDetailValue | null>(null);

function useProjectDetail(): ProjectDetailValue {
  const ctx = useContext(ProjectDetailContext);
  if (!ctx) {
    throw new Error(
      "useProjectDetail must be used within the project detail container",
    );
  }
  return ctx;
}

/** Active tab slug from the current path: /projects/<id>/<slug>. */
function activeTabSlug(pathname: string): string | undefined {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length > 2 ? segments[2] : undefined;
}

export function ProjectDetailContainer({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = usePmsProject(projectId);

  const activeTab =
    getProjectDetailTab(activeTabSlug(pathname) ?? "") ??
    // Default tab is Overview (proposed — TBC, IA-TBC-17).
    getProjectDetailTab("overview");

  if (isError) {
    // SCR-03 error state: unknown/deleted project id — not-found Card with
    // back-to-list Button (SCR-02).
    return (
      <EmptyState
        title="Project not found"
        message={`No project record exists for "${projectId}". The project may be unknown, deleted, or archived — archiving/deletion rules are to be confirmed (IA-TBC-01).`}
        action={
          <Button
            label="Back to projects"
            onPress={() => router.push("/projects")}
            className="w-auto self-start"
          />
        }
      />
    );
  }

  if (isLoading || !project || !activeTab) {
    return (
      <View className="gap-4">
        <SkeletonBlock className="h-4 w-56" />
        <SkeletonBlock className="h-7 w-72" />
        <SkeletonBlock className="h-4 w-64" />
        <SkeletonBlock className="h-10 w-full max-w-[640px] rounded-xl" />
        <SkeletonBlock className="h-48 w-full" />
      </View>
    );
  }

  return (
    <ProjectDetailContext.Provider value={{ project }}>
      <View className="w-full">
        <Breadcrumbs
          items={[
            { label: "Projects", href: "/projects" },
            { label: project.name },
            // Tab crumb only on a tab route (the container itself redirects to Overview).
            ...(activeTabSlug(pathname) ? [{ label: activeTab.label }] : []),
          ]}
        />

        {/* Detail header: project identity (fields TBC, IA-TBC-01) + lifecycle
            status badge (values TBC, IA-TBC-02). */}
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-2xl font-semibold text-fg dark:text-fg-dark">
            {project.name}
          </Text>
          <Text className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-fg/60 dark:bg-white/10 dark:text-fg-dark/60">
            {project.code}
          </Text>
          <StatusBadge label={project.lifecycleStatus} />
          <Text className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-fg/60 dark:bg-white/10 dark:text-fg-dark/60">
            {activeTab.screenId}
          </Text>
        </View>
        <Text className="mt-1 text-xs text-fg/50 dark:text-fg-dark/50">
          Provisional demo data — identifying fields and status values are to be
          confirmed (IA-TBC-01, IA-TBC-02).
        </Text>

        {/* Secondary navigation (IA §4.2): one entry per detail area. */}
        <View className="mt-5 flex-row flex-wrap gap-2">
          {PROJECT_DETAIL_TABS.map((tab) => {
            const isActive = tab.slug === activeTab.slug;
            return (
              <Pressable
                key={tab.slug}
                accessibilityRole="link"
                accessibilityState={{ selected: isActive }}
                onPress={() =>
                  router.push(`/projects/${projectId}/${tab.slug}`)
                }
                className={cn(
                  "rounded-xl px-3.5 py-2 transition-colors",
                  isActive
                    ? "bg-brand"
                    : "hover:bg-black/5 dark:hover:bg-white/10",
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-white" : "text-fg/70 dark:text-fg-dark/70",
                  )}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Active tab's screen responsibility (screen-specification §3). */}
        <Text className="mt-4 max-w-[640px] text-sm text-fg/70 dark:text-fg-dark/70">
          {activeTab.responsibility}
        </Text>

        <View className="mt-4">{children}</View>
      </View>
    </ProjectDetailContext.Provider>
  );
}

/**
 * Content of a project detail tab route (SCR-04…SCR-12). Detail areas without a
 * confirmed data model render their empty state (screen-specification §2.2) with the
 * matching TBC reference; Overview shows the provisional record (orchestrator
 * decision 5) and Lifecycle shows the current status only (no history yet).
 */
export function ProjectTabContent({ slug }: { slug: string }) {
  const tab: ProjectDetailTab | undefined = getProjectDetailTab(slug);
  const { project } = useProjectDetail();
  if (!tab) return null;

  if (slug === "overview") {
    return <OverviewContent project={project} />;
  }

  if (slug === "lifecycle") {
    return <LifecycleContent project={project} tab={tab} />;
  }

  return (
    <EmptyState
      title={tab.emptyTitle}
      message={tab.emptyMessage}
      tbcId={tab.tbcId}
    />
  );
}

function DefinitionRow({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast: boolean;
}) {
  return (
    <View
      className={cn(
        "flex-row items-start justify-between gap-4 py-3",
        !isLast && "border-b border-border dark:border-border-dark",
      )}
    >
      <Text className="text-sm text-fg/60 dark:text-fg-dark/60">{label}</Text>
      <Text className="flex-1 text-right text-sm font-medium text-fg dark:text-fg-dark">
        {value}
      </Text>
    </View>
  );
}

/** SCR-04: provisional identification fields (IA-TBC-01). */
function OverviewContent({ project }: { project: PmsProjectRecord }) {
  const rows = [
    { label: "Project code (provisional)", value: project.code },
    { label: "Project name (provisional)", value: project.name },
    { label: "Lifecycle status (provisional)", value: project.lifecycleStatus },
  ];

  return (
    <Card>
      <CardHeader className="items-start">
        <CardTitle className="text-base">Identification</CardTitle>
        <CardDescription>
          Identification fields are to be confirmed (IA-TBC-01) — the values
          below are provisional demo data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rows.map((row, index) => (
          <DefinitionRow
            key={row.label}
            label={row.label}
            value={row.value}
            isLast={index === rows.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

/** SCR-05: current status only — history/transitions are TBC (IA-TBC-02). */
function LifecycleContent({
  project,
  tab,
}: {
  project: PmsProjectRecord;
  tab: ProjectDetailTab;
}) {
  return (
    <View className="gap-4">
      <Card>
        <CardHeader className="items-start">
          <CardTitle className="text-base">Current status</CardTitle>
          <CardDescription>
            The status list and displayed values are to be confirmed (IA-TBC-02)
            — the badge below shows a provisional demo value.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StatusBadge label={project.lifecycleStatus} />
        </CardContent>
      </Card>

      <EmptyState
        title={tab.emptyTitle}
        message={tab.emptyMessage}
        tbcId={tab.tbcId}
      />
    </View>
  );
}
