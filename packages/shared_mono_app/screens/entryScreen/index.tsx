"use client";

import { EntryFeature } from "shared_mono_app/features/entryFeature";

import { SafeAreaView } from "ui/components/safeArea";

export function EntryPage() {
  return (
    <SafeAreaView
      className="w-full h-full flex-1"
      edges={["left", "right", "bottom"]}
    >
      <EntryFeature />
    </SafeAreaView>
  );
}
