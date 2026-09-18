"use client";
import React from "react";
import { Button } from "ui/components/button";
import { Card } from "ui/components/card";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { cn } from "ui/utils/cn";

/**
 * Shared screen state conventions (screen-specification.md §2.2, PM-002).
 * Global loading/empty/error copy wording is itself TBC (SCR-TBC-03) — the copy here
 * is scaffold-neutral and must be revisited when that is confirmed.
 */

/** Placeholder block for non-tabular loading zones (no full-screen spinners). */
export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <View
      className={cn(
        "animate-pulse rounded-xl bg-black/10 dark:bg-white/10",
        className,
      )}
    />
  );
}

/**
 * Explicit "awaiting confirmation" placeholder for content whose specification is
 * still TBC (used for the dashboard zones, IA-TBC-11, and TBC screen structures).
 */
export function AwaitingConfirmation({
  label,
  tbcId,
  className,
}: {
  label: string;
  tbcId: string;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "items-center rounded-xl border border-dashed border-border px-4 py-6 dark:border-border-dark",
        className,
      )}
    >
      <Text className="text-sm font-medium text-fg/80 dark:text-fg-dark/80">
        {label}
      </Text>
      <Text className="mt-1 text-xs text-fg/60 dark:text-fg-dark/60">
        Awaiting confirmation ({tbcId})
      </Text>
    </View>
  );
}

/**
 * Empty state: a Card with a short explanation and — only where a create action is
 * confirmed — a CTA. Zero rows are never presented as an error.
 */
export function EmptyState({
  title,
  message,
  tbcId,
  action,
  className,
}: {
  title: string;
  message: string;
  tbcId?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("items-center gap-2 py-10", className)}>
      <Text className="text-base font-semibold text-fg dark:text-fg-dark">
        {title}
      </Text>
      <Text className="max-w-[480px] text-center text-sm text-fg/70 dark:text-fg-dark/70">
        {message}
      </Text>
      {tbcId ? (
        <Text className="text-xs text-fg/50 dark:text-fg-dark/50">
          To be confirmed ({tbcId})
        </Text>
      ) : null}
      {action}
    </Card>
  );
}

/** Error state: Card with explanation in the `danger` token and a retry Button. */
export function ErrorState({
  title,
  message = "Data could not be loaded. Please try again.",
  onRetry,
  action,
  className,
}: {
  title?: string;
  message?: string;
  onRetry: () => void;
  /** Optional secondary action (e.g. back-to-list, SCR-03 error state). */
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-3", className)}>
      {title ? (
        <Text className="text-base font-semibold text-fg dark:text-fg-dark">
          {title}
        </Text>
      ) : null}
      <Text className="text-sm text-danger">{message}</Text>
      <View className="flex-row items-center gap-3">
        <Button label="Retry" onPress={onRetry} className="w-auto" />
        {action}
      </View>
    </Card>
  );
}

/** Lifecycle status badge (concept confirmed; displayed values TBC — IA-TBC-02). */
export function StatusBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "self-start rounded-full bg-brand/10 px-2.5 py-1 dark:bg-brand/20",
        className,
      )}
    >
      <Text className="text-xs font-medium text-brand dark:text-brand">
        {label}
      </Text>
    </View>
  );
}
