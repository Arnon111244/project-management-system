"use client";

import { useEffect } from "react";

/**
 * Dev-time helper: auto-reload when a Webpack/Next chunk fails to load (ChunkLoadError).
 * This typically happens after long idle HMR sessions where old chunks are purged.
 */
export default function ChunkRecovery() {
  useEffect(() => {
    const onUnhandled = (event: PromiseRejectionEvent) => {
      const msg = String(event.reason?.message || event.reason || "");
      if (
        msg.includes("ChunkLoadError") ||
        msg.includes("Loading chunk") ||
        msg.includes("Failed to fetch dynamically imported module")
      ) {
        // Avoid infinite loops: only reload once per session
        const key = "__chunk_reloaded__";
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          location.reload();
        }
      }
    };
    const onError = (event: ErrorEvent) => {
      const msg = String(event.message || "");
      if (msg.includes("ChunkLoadError") || msg.includes("Loading chunk")) {
        const key = "__chunk_reloaded__";
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          location.reload();
        }
      }
    };
    window.addEventListener("unhandledrejection", onUnhandled);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onUnhandled);
      window.removeEventListener("error", onError);
      sessionStorage.removeItem("__chunk_reloaded__");
    };
  }, []);
  return null;
}
