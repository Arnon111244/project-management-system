export const neuralDark = {
  canvas: "#08090D",
  surface: "#0F1117",
  elevated: "#151821",
  tile: "#1A1D27",
  tileHover: "#1F2330",
  border: "rgba(255,255,255,0.08)",
  borderGlow: "rgba(34,211,238,0.35)",
  chrome: "rgba(8,9,13,0.92)",
  dock: "rgba(15,17,23,0.94)",
  cyan: "#22D3EE",
  cyanSoft: "rgba(34,211,238,0.12)",
  violet: "#A78BFA",
  violetSoft: "rgba(167,139,250,0.14)",
  text: "#F4F4F5",
  textSecondary: "rgba(255,255,255,0.62)",
  textDim: "rgba(255,255,255,0.38)",
  positive: "#34D399",
  warning: "#FBBF24",
  negative: "#F87171",
  gradientFrom: "#22D3EE",
  gradientTo: "#A78BFA",
  onAccent: "#08090D",
} as const;

export const neuralLight = {
  canvas: "#F4F6FA",
  surface: "#FFFFFF",
  elevated: "#F1F4F9",
  tile: "#FFFFFF",
  tileHover: "#E8EDF5",
  border: "rgba(15,23,42,0.10)",
  borderGlow: "rgba(8,145,178,0.28)",
  chrome: "rgba(255,255,255,0.92)",
  dock: "rgba(255,255,255,0.96)",
  cyan: "#0891B2",
  cyanSoft: "rgba(8,145,178,0.10)",
  violet: "#7C3AED",
  violetSoft: "rgba(124,58,237,0.10)",
  text: "#0F172A",
  textSecondary: "rgba(15,23,42,0.68)",
  textDim: "rgba(15,23,42,0.45)",
  positive: "#059669",
  warning: "#D97706",
  negative: "#DC2626",
  gradientFrom: "#0891B2",
  gradientTo: "#7C3AED",
  onAccent: "#FFFFFF",
} as const;

export type NeuralPalette = {
  canvas: string;
  surface: string;
  elevated: string;
  tile: string;
  tileHover: string;
  border: string;
  borderGlow: string;
  chrome: string;
  dock: string;
  cyan: string;
  cyanSoft: string;
  violet: string;
  violetSoft: string;
  text: string;
  textSecondary: string;
  textDim: string;
  positive: string;
  warning: string;
  negative: string;
  gradientFrom: string;
  gradientTo: string;
  onAccent: string;
};

const NEURAL_CSS_KEYS = Object.keys(neuralDark) as (keyof NeuralPalette)[];

export function getNeuralPalette(scheme: "light" | "dark"): NeuralPalette {
  return scheme === "light" ? neuralLight : neuralDark;
}

export function applyNeuralCssVars(
  palette: NeuralPalette,
  root?: HTMLElement | null,
) {
  if (typeof document === "undefined") return;
  const el = root ?? document.documentElement;
  NEURAL_CSS_KEYS.forEach((key) => {
    el.style.setProperty(`--neural-${key}`, palette[key]);
  });
}

export function neuralTailwindColors(fallback = neuralDark) {
  return Object.fromEntries(
    NEURAL_CSS_KEYS.map((key) => [
      key,
      `var(--neural-${key}, ${fallback[key]})`,
    ]),
  ) as Record<keyof NeuralPalette, string>;
}

export function syncNeuralTheme(scheme: "light" | "dark") {
  const palette = getNeuralPalette(scheme);
  applyNeuralCssVars(palette);
  return palette;
}
