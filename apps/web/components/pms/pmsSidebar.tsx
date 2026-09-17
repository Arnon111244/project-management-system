"use client";
import React from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { usePathname, useRouter } from "next/navigation";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { cn } from "ui/utils/cn";
import { colors } from "ui/theme";
import { useTheme } from "ui/theme/themeProvider";
import { useGlobalStore } from "state/index";
import { PMS_PRIMARY_NAV, isPmsNavActive } from "../../lib/pms/navigation";

/**
 * Primary sidebar navigation (IA §4.1, PM-002): a persistent left sidebar listing the
 * cross-project screens (SCR-01, SCR-02, SCR-13, SCR-14). Project-scoped tabs
 * (SCR-04…SCR-12) never appear here — they are reached through the project detail
 * tabs (secondary navigation, IA §4.2).
 *
 * Composed at app level on the template's building blocks: the global sidebar state
 * (`packages/state` sidebar slice), the nav item visuals of the `webSideBar` family,
 * and the lucide icons already used by the navBar. Sidebar collapse/expand behavior
 * is TBC (IA-TBC-18) — the topbar hamburger toggles the same store state.
 */

export const PMS_SIDEBAR_WIDTH = 272;

export function PmsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { effective } = useTheme();
  const isDark = effective === "dark";
  const isOpen = useGlobalStore((s) => s.sidebar.isOpen);
  const toggleSidebar = useGlobalStore((s) => s.toggleSidebar);

  const overlay = width < 900;

  // Lock body scroll while the sidebar overlays the content on narrow viewports
  // (same behavior as the template webSideBar).
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen && overlay) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, overlay]);

  if (!isOpen) return null;

  return (
    <>
      {overlay ? (
        <Pressable
          accessibilityLabel="Close navigation"
          className="fixed inset-0 z-[45] bg-black/50"
          onPress={toggleSidebar}
        />
      ) : null}

      <View
        className={cn(
          "z-50 h-screen overflow-y-auto border-e border-border bg-surface dark:border-border-dark dark:bg-black",
          overlay
            ? "fixed inset-y-0 left-0 w-[272px]"
            : "sticky top-0 w-[272px] shrink-0",
        )}
      >
        <View className={cn("gap-1.5 px-3", overlay ? "pt-[70px]" : "pt-5")}>
          {PMS_PRIMARY_NAV.map((item) => {
            const active = isPmsNavActive(item.path, pathname);
            const Icon = item.icon;
            return (
              <Pressable
                key={item.key}
                accessibilityRole="link"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  router.push(item.path);
                  if (overlay) toggleSidebar();
                }}
                className={cn(
                  "flex-row items-center gap-2 rounded-2xl px-3 py-2.5 transition-colors",
                  active
                    ? "bg-brand/10 dark:bg-brand/20"
                    : "hover:bg-black/5 dark:hover:bg-white/10",
                )}
              >
                <Icon
                  size={20}
                  color={
                    active ? colors.brand : isDark ? colors.white : colors.fg
                  }
                />
                <Text
                  className={cn(
                    "text-sm font-medium",
                    active
                      ? "text-brand dark:text-brand"
                      : "text-fg/80 dark:text-white/80",
                  )}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}
