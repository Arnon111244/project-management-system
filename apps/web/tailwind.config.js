/** @type {import('tailwindcss').Config} */
const { colors } = require("../../packages/ui/theme/colors.ts");
const {
  neuralTailwindColors,
} = require("../../packages/ui/theme/neuralTokens.ts");

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/shared_mono_app/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  important: "html",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "brand-dark": colors.brandDark,
        dark: colors.dark,
        brand: colors.brand,
        "brand-hover": colors.brandHover,
        surface: colors.surface,
        "light-cyan": colors.lightCyan,
        border: colors.border,
        danger: colors.danger,
        link: colors.link,
        fg: colors.fg,
        white: colors.white,
        black: colors.black,
        "muted-dark": colors.mutedDark,
        "border-dark": colors.borderDark,
        "fg-dark": colors.fgDark,
        charcoal: colors.charcoal,
        gray: colors.gray,
        silver: colors.silver,
        "dark-gray": colors.darkGray,
        "light-gray": colors.lightGray,
        "medium-gray": colors.mediumGray,
        neural: neuralTailwindColors(),
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
