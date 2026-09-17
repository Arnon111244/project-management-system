"use client";

import { Platform, useWindowDimensions } from "react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { NEURAL, neuralAlpha } from "ui/theme/neuralRuntime";
import { scrollToSection } from "../utils/scrollToSection";
import { Pressable } from "react-native";

export function PromoStrip() {
  const { width } = useWindowDimensions();
  const isCompact = width < 640;
  const isTight = width < 400;

  return (
    <Pressable
      onPress={() => scrollToSection("versions")}
      accessibilityRole="button"
      accessibilityLabel="View free vs premium versions"
      className="w-full border-b"
      style={{
        backgroundColor: neuralAlpha(NEURAL.cyan, 0.1),
        borderColor: NEURAL.borderGlow,
      }}
    >
      <View className="w-full max-w-[1100px] mx-auto px-3 sm:px-4 py-2 sm:py-2.5 min-w-0">
        {isCompact ? (
          <View className="flex-row flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <Text
              className={`${isTight ? "text-[10px]" : "text-[11px]"} font-semibold uppercase tracking-wide text-center`}
              style={{ color: NEURAL.cyan }}
            >
              Free ThemeWagon build
            </Text>
            {!isTight ? (
              <Text
                className="text-[11px] text-center"
                style={{ color: NEURAL.textDim }}
              >
                ·
              </Text>
            ) : null}
            <Text
              className={`${isTight ? "text-[10px]" : "text-[11px]"} text-center`}
              style={{ color: NEURAL.textSecondary }}
              numberOfLines={2}
            >
              {isTight
                ? "Full source · Premium available"
                : "Full source code · Premium upgrade"}
            </Text>
            <Text
              className={`${isTight ? "text-[10px]" : "text-[11px]"} font-semibold text-center`}
              style={{ color: NEURAL.violet }}
            >
              See versions →
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <Text
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: NEURAL.cyan }}
            >
              Free ThemeWagon build
            </Text>
            <Text
              className="text-xs hidden md:flex"
              style={{ color: NEURAL.textDim }}
            >
              ·
            </Text>
            <Text
              className="text-xs text-center flex-shrink"
              style={{ color: NEURAL.textSecondary }}
              numberOfLines={Platform.OS === "web" ? 1 : 2}
            >
              Full source code · No signup · Premium dashboard available
            </Text>
            <Text
              className="text-xs font-semibold shrink-0"
              style={{ color: NEURAL.violet }}
            >
              See versions →
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
