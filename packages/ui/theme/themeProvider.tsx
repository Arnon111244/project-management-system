"use client";
import {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  useContext,
  createContext,
} from "react";
import { Platform } from "react-native";
import { useColorScheme } from "nativewind";
import { applyNeuralCssVars, getNeuralPalette } from "ui/theme";
import type { NeuralPalette } from "ui/theme/neuralTokens";
import { setNeuralPalette } from "ui/theme/neuralRuntime";

type Scheme = "light" | "dark";
export type ThemePref = Scheme;

/** Dark-first (spec §3): dark remains the default preference. */
export const DEFAULT_THEME_PREF: ThemePref = "dark";

type Ctx = {
  pref: ThemePref;
  effective: Scheme;
  setPref: (next: ThemePref | "light" | "system") => void;
  neural: NeuralPalette;
};

const ThemeCtx = createContext<Ctx | null>(null);

function setHtmlDarkClass(dark: boolean) {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useColorScheme();

  // PM-002: the theme preference is now selectable (dark | light) instead of locked
  // to dark, so the topbar theme toggle works. Dark stays the default and no
  // persistence layer is introduced — preference lives at provider level.
  const [pref, setPrefState] = useState<ThemePref>(DEFAULT_THEME_PREF);

  const palette = getNeuralPalette(pref);

  const applyTheme = useCallback(() => {
    setColorScheme(pref);
    setHtmlDarkClass(pref === "dark");
    setNeuralPalette(palette);
    if (Platform.OS === "web") applyNeuralCssVars(palette);
  }, [palette, pref, setColorScheme]);

  useLayoutEffect(() => {
    applyTheme();
  }, [applyTheme]);

  const setPref = useCallback((next: ThemePref | "light" | "system") => {
    // "system" is not part of the confirmed direction (spec §3: dark-first with a
    // light mode) — ignore it until it is confirmed.
    if (next !== "light" && next !== "dark") return;
    setPrefState(next);
  }, []);

  const value = useMemo<Ctx>(
    () => ({ pref, effective: pref, setPref, neural: palette }),
    [palette, pref, setPref],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function useNeuralPalette() {
  return useTheme().neural;
}
