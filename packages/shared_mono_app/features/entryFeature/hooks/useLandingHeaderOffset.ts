import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const NAVBAR_HEIGHT = 64;

/** Approximate promo strip height by breakpoint (supports wrapped mobile copy). */
export function getPromoStripHeight(width: number): number {
  if (width < 400) return 56;
  if (width < 640) return 48;
  return 40;
}

export function useLandingHeaderOffset(): number {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const promoHeight = getPromoStripHeight(width);
  const topInset = Platform.OS === "web" ? 0 : insets.top;
  return topInset + promoHeight + NAVBAR_HEIGHT;
}
