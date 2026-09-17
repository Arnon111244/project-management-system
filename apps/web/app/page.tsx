"use client";
import { EntryPage } from "shared_mono_app/screens/entryScreen";
import { useTheme } from "ui/theme/themeProvider";

export default function Page() {
  useTheme();

  return (
    <div className="w-full min-h-full justify-center items-center">
      <EntryPage />
    </div>
  );
}
