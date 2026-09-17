import { Platform } from "react-native";
import { useEffect, useState } from "react";
import { navigate } from "shared_mono_app/utils/router";

export const WEB_BOTTOM_BAR_HEIGHT = 76;

const norm = (p?: string) =>
  (p ?? "/")?.split("?")[0]?.replace(/\/+$/, "") || "/";
export const pathsEqual = (a?: string, b?: string) => norm(a) === norm(b);

export function useActivePath(provided?: string) {
  const [path, setPath] = useState<string>(() => {
    if (provided) return provided;
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.location.pathname || "/";
    }
    return "/";
  });

  useEffect(() => {
    if (provided) {
      setPath(provided);
      return;
    }
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const handler = () => setPath(window.location.pathname || "/");
      window.addEventListener("popstate", handler);
      return () => window.removeEventListener("popstate", handler);
    }
  }, [provided]);

  return path;
}

export function safeNavigate(
  path: string,
  onError?: (p: string, e: unknown) => void,
  currentPath?: string,
) {
  if (pathsEqual(currentPath, path)) return;
  try {
    navigate(path);
  } catch (e) {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.location.assign(path);
      return;
    }
    console.warn("Navigation failed for path", path, e);
    onError?.(path, e);
  }
}
