/** @type {import('tailwindcss').Config} */
const { colors } = require("../../packages/ui/theme/colors.ts");
const {
  neuralTailwindColors,
} = require("../../packages/ui/theme/neuralTokens.ts");

module.exports = {
  darkMode: "class",
  content: [
    "./index.js",
    "./app/**/*.{js,jsx,ts,tsx}",
    "../../packages/shared_mono_app/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        "brand-hover": colors.brandHover,
        surface: colors.surface,
        border: colors.border,
        danger: colors.danger,
        link: colors.link,
        fg: colors.fg,
        white: colors.white,
        black: colors.black,
        "light-cyan": colors.lightCyan,
        dark: colors.dark,
        "muted-dark": colors.mutedDark,
        "border-dark": colors.borderDark,
        "fg-dark": colors.fgDark,
        "brand-dark": colors.brandDark,
        charcoal: colors.charcoal,
        gray: colors.gray,
        silver: colors.silver,
        "dark-gray": colors.darkGray,
        "light-gray": colors.lightGray,
        "medium-gray": colors.mediumGray,
        neural: neuralTailwindColors(),
      },
    },
  },
  plugins: [],
};
