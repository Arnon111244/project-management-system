import { FlatList, Pressable } from "react-native";
import { Text } from "ui/components/text";
import { RadioButton } from "ui/components/radioButton";
import type { SelectOption } from "../types";
import { colors } from "ui/theme";

interface AndroidListProps {
  options: SelectOption[];
  tempValue: string;
  onTempChange: (value: string) => void;
  isRTL: boolean;
  rippleConfig: any;
  theme: "light" | "dark";
}

export function AndroidList({
  options,
  tempValue,
  onTempChange,
  isRTL,
  rippleConfig,
  theme,
}: AndroidListProps) {
  const borderColor = theme === "dark" ? "#333" : "#E5E7EB";
  const textColor = theme === "dark" ? "#FFFFFF" : "#0B0B0C";

  return (
    <FlatList
      style={{ maxHeight: 800 }}
      data={options}
      keyExtractor={(o) => o.value}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => {
        const isSelected = item.value === tempValue;
        return (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onTempChange(item.value);
            }}
            android_ripple={rippleConfig}
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderColor: borderColor,
            }}
          >
            <Text
              style={{
                color: textColor,
                fontSize: 16,
                flex: 1,
                textAlign: isRTL ? "right" : "left",
              }}
              numberOfLines={1}
            >
              {item.label}
            </Text>

            <RadioButton
              color={colors.brand}
              selected={isSelected}
              onPress={() => onTempChange(item.value)}
            />
          </Pressable>
        );
      }}
    />
  );
}
