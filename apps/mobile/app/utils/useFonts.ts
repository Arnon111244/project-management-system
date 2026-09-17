// This file lives under app/, so Expo Router treats it as a route.
// We moved the real fonts hook to `src/hooks/useFonts`.
// Keep a no-op default export here to satisfy Router and avoid warnings.
import React from "react";

export default function UseFontsRoute() {
  return null;
}
