import { Platform, type ViewStyle } from "react-native";

export const isWeb = Platform.OS === "web";

/** CSS blur — web only. Never pass to native views. */
export function webBlurStyle(radius: number): ViewStyle | undefined {
  if (!isWeb) return undefined;
  return { filter: `blur(${radius}px)` } as ViewStyle;
}

/** Card grid helpers — keep natural height so web/mobile scroll content does not grow without bound. */
export const landingCardGrid = "flex-row flex-wrap -mx-3";

export const landingCardGridItem = (widthClass: string) =>
  `${widthClass} px-3 mb-6`;

export const landingCardShell = "w-full";

export const landingCardSurface = "flex-col";
