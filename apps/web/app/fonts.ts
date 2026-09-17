import localFont from "next/font/local";

export const favoritArabic = localFont({
  src: [
    {
      path: "../../../packages/ui/assets/fonts/ABCFavoritArabic-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../packages/ui/assets/fonts/ABCFavoritArabic-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../packages/ui/assets/fonts/ABCFavoritArabic-Regular.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../packages/ui/assets/fonts/ABCFavoritArabic-Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../packages/ui/assets/fonts/ABCFavoritArabic-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial"],
});
