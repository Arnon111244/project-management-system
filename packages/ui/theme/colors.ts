import { neuralDark, neuralLight } from "./neuralTokens";

export const colors = {
  brandDark: "#3C3FFF",
  dark: "#0a0a0a",
  surface: "#F9FAFB",
  brand: "#02c0ce",
  brandHover: "#36dbe0",
  lightCyan: "#e3f5fa",
  white: "#FFFFFF",
  black: "#171717",
  border: "#E5E5E5",
  ghostHover: "#C7D2FE",
  danger: "#DC2626",
  link: "#3C3FFF",
  fg: "#0B0B0C",
  mutedDark: "#1F1F1F",
  borderDark: "#2A2A2A",
  fgDark: "#FFFFFF",
  charcoal: "#383838",
  darkCharcoal: "#292727",
  gray: "#E0E0E0",
  silver: "#EEEEEE",
  darkGray: "#323232",
  lightGray: "#BDBDBD",
  mediumGray: "#616161",
  green: "#00c700",
  neural: {
    dark: neuralDark,
    light: neuralLight,
  },
} as const;

export type ColorKey = keyof typeof colors;
