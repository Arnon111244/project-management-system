"use client";
import React from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { Moon, Sun, User } from "lucide-react-native";
import { BrandLogoMark } from "ui/components/brandLogoMark";
import { HamburgerToggle } from "ui/components/hamburgerToggle";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { cn } from "ui/utils/cn";
import { colors, NEURAL } from "ui/theme";
import { useTheme } from "ui/theme/themeProvider";
import { useGlobalStore } from "state/index";
import { WEB_TOP_BAR_HEIGHT } from "ui/components/navBar/topBar";
import { PMS_SIDEBAR_WIDTH } from "./pmsSidebar";

/**
 * Global topbar (IA §4.4, PM-002): brand mark, sidebar collapse toggle (IA-TBC-18),
 * and the working dark/light theme toggle (dark-first with light mode is confirmed,
 * spec §3). The account area is a reserved placeholder — authentication/users are TBC
 * (IA-TBC-13). Notifications and global search have no default placement (IA-TBC-14,
 * IA-TBC-20) and are intentionally omitted.
 */
export function PmsTopBar() {
  const { effective, setPref } = useTheme();
  const isDark = effective === "dark";
  const isOpen = useGlobalStore((s) => s.sidebar.isOpen);
  const toggleSidebar = useGlobalStore((s) => s.toggleSidebar);
  const { width } = useWindowDimensions();
  const overlay = width < 900;

  return (
    <View
      className={cn(
        "fixed right-0 top-0 z-40 flex-row items-center justify-between border-b border-border bg-white px-3 dark:border-border-dark dark:bg-black",
      )}
      style={{
        height: WEB_TOP_BAR_HEIGHT,
        left: isOpen && !overlay ? PMS_SIDEBAR_WIDTH : 0,
      }}
    >
      <View className="flex-row items-center gap-2">
        <HamburgerToggle isOpen={isOpen} onToggle={toggleSidebar} />
        <BrandLogoMark />
        {/* Brand name/logo assets are TBC (IA-TBC-19) — working title only. */}
        <Text className="text-base font-semibold text-fg dark:text-fg-dark">
          PMS
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isDark ? "Switch to light theme" : "Switch to dark theme"
          }
          onPress={() => setPref(isDark ? "light" : "dark")}
          className="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/10"
        >
          {isDark ? (
            <Sun size={20} color={colors.fgDark} />
          ) : (
            <Moon size={20} color={colors.fg} />
          )}
        </Pressable>

        <View
          accessibilityLabel="Account area — to be confirmed (IA-TBC-13)"
          className="rounded-full border border-border p-1.5 dark:border-border-dark"
        >
          <User size={18} color={NEURAL.textDim} />
        </View>
      </View>
    </View>
  );
}
