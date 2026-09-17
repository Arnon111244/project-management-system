"use client";
import {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useContext,
  createContext,
} from "react";
import { Platform } from "react-native";
import { useColorScheme } from "nativewind";
import { applyNeuralCssVars, getNeuralPalette } from "ui/theme";
import type { NeuralPalette } from "ui/theme/neuralTokens";
import { setNeuralPalette } from "ui/theme/neuralRuntime";

type Scheme = "dark";
export type ThemePref = Scheme;

export const DEFAULT_THEME_PREF: ThemePref = "dark";

type Ctx = {
  pref: ThemePref;
  effective: Scheme;
  setPref: (next: ThemePref | "light" | "system") => void;
  neural: NeuralPalette;
};

const ThemeCtx = createContext<Ctx | null>(null);
const DARK_PALETTE = getNeuralPalette("dark");

function setHtmlDarkClass() {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  document.documentElement.classList.add("dark");
}

function syncDarkPalette() {
  setNeuralPalette(DARK_PALETTE);
  if (Platform.OS === "web") applyNeuralCssVars(DARK_PALETTE);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useColorScheme();

  const applyDark = useCallback(() => {
    setColorScheme("dark");
    if (Platform.OS === "web") setHtmlDarkClass();
    syncDarkPalette();
  }, [setColorScheme]);

  useLayoutEffect(() => {
    applyDark();
  }, [applyDark]);

  const setPref = useCallback(() => {}, []);

  const value = useMemo<Ctx>(
    () => ({
      pref: "dark",
      effective: "dark",
      setPref,
      neural: DARK_PALETTE,
    }),
    [setPref],
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
