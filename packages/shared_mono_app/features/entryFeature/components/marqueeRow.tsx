"use client";

import type { ViewStyle } from "react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { useNeuralPalette } from "ui/theme/themeProvider";

type MarqueeRowProps = {
  items: readonly string[];
};

/** Static brand/tech row — always LTR so mixed labels stay readable in RTL pages. */
const ROW_LTR: ViewStyle = { direction: "ltr" };

export function MarqueeRow({ items }: MarqueeRowProps) {
  const neural = useNeuralPalette();
  const pillClass = "rounded-full border px-5 py-2.5 shrink-0";
  const pillStyle = {
    borderColor: neural.border,
    backgroundColor: neural.tile,
  };
  const textStyle = { color: neural.textSecondary };

  return (
    <View
      className="flex-row flex-wrap justify-center gap-3 px-4"
      style={ROW_LTR}
    >
      {items.map((item) => (
        <View key={item} className={pillClass} style={pillStyle}>
          <Text
            className="text-sm font-semibold whitespace-nowrap"
            style={textStyle}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
