import React, { memo } from "react";
import { Pressable, Platform } from "react-native";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";
import { RadioButton } from "ui/components/radioButton";
import type { SelectOption } from "../types";
import { colors } from "ui/theme";

type OptionItemProps = {
  item: SelectOption;
  selectedValue?: string;
  androidRippleConfig?: any;
  onSelect: (value: string) => void;
  isRTL: boolean;
};

export const OptionItem = memo(
  ({
    item,
    selectedValue,
    androidRippleConfig,
    onSelect,
    isRTL,
  }: OptionItemProps) => {
    const active = item.value === selectedValue;
    return (
      <Pressable
        className={cn(
          "px-3 py-2 flex-row items-center justify-between",
          active ? "bg-light-cyan dark:bg-black" : "bg-surface dark:bg-black",
          "web:hover:bg-gray dark:web:hover:bg-muted-dark",
        )}
        onPress={() => onSelect(item.value)}
        android_ripple={androidRippleConfig}
      >
        <Text
          className="text-sm text-fg dark:text-fg-dark flex-1"
          style={{
            writingDirection: isRTL ? "rtl" : "ltr",
            textAlign: isRTL ? "right" : "left",
          }}
          numberOfLines={1}
        >
          {item.label}
        </Text>
        {active && Platform.OS === "web" && (
          <RadioButton
            color={colors.brand}
            selected={true}
            onPress={() => onSelect(item.value)}
          />
        )}
      </Pressable>
    );
  },
);
