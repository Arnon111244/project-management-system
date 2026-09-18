"use client";
import React from "react";
import { View } from "ui/components/view";
import { WEB_TOP_BAR_HEIGHT } from "ui/components/navBar/topBar";
import { WORKSPACE_CONTENT_MAX_WIDTH } from "ui/components/navBar/workspaceLayout";
import { useGlobalStore } from "state/index";
import { PmsSidebar } from "./pmsSidebar";
import { PmsTopBar } from "./pmsTopBar";

/**
 * Workspace shell (screen-specification.md §2.1, PM-002): persistent left sidebar
 * (primary navigation) + persistent topbar (global elements) + content column bounded
 * by the workspace content pattern (`WORKSPACE_CONTENT_MAX_WIDTH` + edge padding).
 * Every PMS route renders inside this shell.
 *
 * The sidebar starts open on desktop so the primary navigation is visible (persistent
 * sidebar per IA §4.1); collapse via the topbar hamburger (behavior TBC, IA-TBC-18).
 * Nothing is persisted — the store's sidebar state is session-only.
 */
export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const setSidebar = useGlobalStore((s) => s.setSidebar);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const { sidebar } = useGlobalStore.getState();
    if (window.innerWidth >= 900 && !sidebar.isOpen) {
      setSidebar({ isOpen: true });
    }
  }, [setSidebar]);

  return (
    <View className="min-h-screen w-full flex-row">
      <PmsSidebar />

      <View className="min-w-0 flex-1 flex-col">
        <PmsTopBar />
        {/* Offset for the fixed topbar, from the topBar family constant. (The template
            WebTopBarSpacer builds its height class from a JS template literal, so
            Tailwind emits an invalid `calc(${WEB_TOP_BAR_HEIGHT}px+…)` rule and the
            spacer collapses — render the height directly instead.) */}
        <View style={{ height: WEB_TOP_BAR_HEIGHT }} />

        <View
          className="mx-auto w-full flex-1 pb-16"
          style={{ maxWidth: WORKSPACE_CONTENT_MAX_WIDTH }}
        >
          <View className="px-4 pt-6 md:px-6">{children}</View>
        </View>
      </View>
    </View>
  );
}
