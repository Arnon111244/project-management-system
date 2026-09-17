import React, { memo } from "react";
import { Pressable } from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";
import { Check } from "lucide-react-native";
import { colors } from "ui/theme";

interface CheckboxProps {
  isChecked: boolean;
  label: string;
  setIsChecked: (newValue: boolean) => void;
  disabled?: boolean;
  checkedBgColor?: string;
  uncheckedBgColor?: string;
}

const CheckboxComponent = ({
  isChecked,
  label,
  setIsChecked,
  disabled = false,
  checkedBgColor = colors.brand,
  uncheckedBgColor = "transparent",
}: CheckboxProps) => {
  const disabledClasses = disabled ? "opacity-50" : "active:opacity-80";

  return (
    <Pressable
      disabled={disabled}
      className={cn("flex-row items-center self-start", disabledClasses)}
      onPress={() => setIsChecked(!isChecked)}
    >
      <View
        className={cn(
          "w-5 h-5 rounded border justify-center items-center me-2",
        )}
        style={{
          backgroundColor: isChecked ? checkedBgColor : uncheckedBgColor,
          borderColor: checkedBgColor,
        }}
      >
        {isChecked && <Check size={18} color="white" />}
      </View>

      <Text className="text-base text-fg dark:text-fg-dark">{label}</Text>
    </Pressable>
  );
};

export const Checkbox = memo(CheckboxComponent);
