import { Platform } from "react-native";

import { neuralDark } from "./neuralTokens";
import type { NeuralPalette } from "./neuralTokens";

let activePalette: NeuralPalette = neuralDark;

export function setNeuralPalette(palette: NeuralPalette) {
  activePalette = palette;
}

function neuralToken(prop: keyof NeuralPalette): string {
  if (Platform.OS === "web") {
    return `var(--neural-${prop}, ${activePalette[prop]})`;
  }
  return activePalette[prop];
}

/** Theme-aware palette — on web uses CSS vars that update without reload. */
export const NEURAL: NeuralPalette = new Proxy({} as NeuralPalette, {
  get(_target, prop: keyof NeuralPalette) {
    return neuralToken(prop);
  },
});

/** Alpha tint for neural accent colors (web-safe with CSS vars). */
export function neuralAlpha(color: string, alpha: number): string {
  const pct = Math.round(alpha * 100);
  if (Platform.OS === "web" && color.startsWith("var(")) {
    return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
  }
  if (color.startsWith("#") && color.length === 7) {
    const a = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${a}`;
  }
  return color;
}
