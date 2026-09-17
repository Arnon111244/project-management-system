import { LayoutAnimation, Platform } from "react-native";

export const animateEase = (duration = 200) => {
  if (Platform.OS === "web") return;
  LayoutAnimation.configureNext(
    LayoutAnimation.create(
      duration,
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity,
    ),
  );
};

export const phoneKeyboardType = Platform.select({
  ios: "number-pad" as const,
  android: "phone-pad" as const,
  default: "numeric" as const,
});

export const telTextContentType =
  Platform.OS === "ios" ? ("telephoneNumber" as const) : ("none" as const);
