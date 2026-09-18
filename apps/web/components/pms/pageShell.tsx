"use client";
import React from "react";
import { Pressable } from "react-native";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react-native";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { NEURAL } from "ui/theme";

/**
 * Shared page shell (screen-specification.md §2.1, PM-002): breadcrumb trail
 * (IA §4.3), title with screen ID, the screen's responsibility sentence, and the
 * screen-level primary action. Top-level screens (SCR-13, SCR-14) render without
 * breadcrumbs (title only).
 */

export type PageShellCrumb = {
  label: string;
  /** When set (and not the last segment) the crumb links to its parent screen. */
  href?: string;
};

export function Breadcrumbs({ items }: { items: PageShellCrumb[] }) {
  const router = useRouter();
  if (items.length === 0) return null;

  return (
    <View className="mb-2 flex-row flex-wrap items-center">
      {items.map((crumb, index) => {
        const isLast = index === items.length - 1;
        return (
          <View
            key={`${crumb.label}-${index}`}
            className="flex-row items-center"
          >
            {index > 0 ? (
              <ChevronRight size={14} color={NEURAL.textDim} />
            ) : null}
            {crumb.href && !isLast ? (
              <Pressable
                accessibilityRole="link"
                onPress={() => router.push(crumb.href as string)}
              >
                <Text className="px-0.5 text-sm text-brand hover:underline">
                  {crumb.label}
                </Text>
              </Pressable>
            ) : (
              <Text className="px-0.5 text-sm text-fg/60 dark:text-fg-dark/60">
                {crumb.label}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

type PageShellProps = {
  /** Stable screen ID from the information architecture (SCR-01…SCR-14). */
  screenId: string;
  title: string;
  /** Responsibility sentence from screen-specification.md §3. */
  responsibility: string;
  breadcrumbs?: PageShellCrumb[];
  /** Screen-level primary action (Button variant primary, per §2.1). */
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function PageShell({
  screenId,
  title,
  responsibility,
  breadcrumbs,
  action,
  children,
}: PageShellProps) {
  return (
    <View className="w-full">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}

      <View className="flex-row flex-wrap items-center gap-2">
        <Text className="text-2xl font-semibold text-fg dark:text-fg-dark">
          {title}
        </Text>
        <Text className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-fg/60 dark:bg-white/10 dark:text-fg-dark/60">
          {screenId}
        </Text>
      </View>

      <View className="mb-6 mt-2 flex-row flex-wrap items-start justify-between gap-3">
        <Text className="max-w-[640px] text-sm text-fg/70 dark:text-fg-dark/70">
          {responsibility}
        </Text>
        {action}
      </View>

      {children}
    </View>
  );
}
