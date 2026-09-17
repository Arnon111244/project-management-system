import { ScrollView, Pressable } from "react-native";
import { Text } from "ui/components/text";
import { RadioButton } from "ui/components/radioButton";
import type { SelectOption } from "../types";
import { colors } from "ui/theme";

interface IOSPickerProps {
  options: SelectOption[];
  tempValue: string;
  onTempChange: (value: string) => void;
  isRTL: boolean;
  theme: "light" | "dark";
  placeholder?: string;
  selectedOption?: SelectOption | null;
  firstValue?: string;
}

export function IOSPicker({
  options,
  tempValue,
  onTempChange,
  isRTL,
  theme,
}: IOSPickerProps) {
  const color = theme === "dark" ? "#FFFFFF" : "#0B0B0C";
  const borderColor = theme === "dark" ? "#333" : "#E5E7EB";

  return (
    <ScrollView
      style={{ maxHeight: 800 }}
      contentContainerStyle={{ paddingVertical: 10 }}
    >
      {options.map((opt) => {
        const isSelected = String(tempValue) === String(opt.value);
        return (
          <Pressable
            key={opt.value}
            onPress={() => onTempChange(opt.value)}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderColor: borderColor,
              flexDirection: isRTL ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: color,
                fontSize: 16,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {opt.label}
            </Text>
            <RadioButton
              color={colors.brand}
              selected={isSelected}
              onPress={() => onTempChange(opt.value)}
            />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
