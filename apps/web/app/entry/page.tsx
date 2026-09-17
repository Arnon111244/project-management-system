"use client";
import { EntryPage } from "shared_mono_app/screens/entryScreen";
import { useTheme } from "ui/theme/themeProvider";

/**
 * PM-002: the template landing page, relocated intact from app/page.tsx to /entry
 * so that "/" can open on the dashboard. The shared_mono_app entryFeature components
 * are unchanged.
 */
export default function Page() {
  useTheme();

  return (
    <div className="w-full min-h-full justify-center items-center">
      <EntryPage />
    </div>
  );
}
