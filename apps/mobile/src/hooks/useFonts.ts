import * as SplashScreen from "expo-splash-screen";
import { useEffect, useCallback } from "react";
import { useFonts as useExpoFonts } from "expo-font";

// Prevent a flicker by keeping splash on until fonts are ready
SplashScreen.preventAutoHideAsync().catch(() => {
  /* no-op if already hidden */
});

export function useFonts() {
  const [loaded, error] = useExpoFonts({
    ABCFavoritArabicLight: require("ui/assets/fonts/ABCFavoritArabic-Light.otf"),
    ABCFavoritArabicBook: require("ui/assets/fonts/ABCFavoritArabic-Book.otf"),
    ABCFavoritArabicRegular: require("ui/assets/fonts/ABCFavoritArabic-Regular.otf"),
    ABCFavoritArabicMedium: require("ui/assets/fonts/ABCFavoritArabic-Medium.otf"),
    ABCFavoritArabicBold: require("ui/assets/fonts/ABCFavoritArabic-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  const getFontFamily = useCallback((weight?: number | string) => {
    // Map RN fontWeight to loaded font family
    const w = String(weight ?? "400");
    switch (w) {
      case "300":
      case "light":
        return "ABCFavoritArabicLight";
      case "400":
      case "normal":
      case "book":
        return "ABCFavoritArabicBook";
      case "500":
      case "regular":
        return "ABCFavoritArabicRegular";
      case "600":
      case "medium":
        return "ABCFavoritArabicMedium";
      case "700":
      case "bold":
        return "ABCFavoritArabicBold";
      default:
        return "ABCFavoritArabicBook";
    }
  }, []);

  return { loaded, error, getFontFamily };
}
