import React, { useMemo } from "react";
import { Pressable, Platform, View } from "react-native";
import { cssInterop } from "nativewind";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "ui/utils/cn";
import { Text } from "ui/components/text";
import { Check } from "lucide-react-native";
import { colors } from "ui/theme";
import { useTheme } from "ui/theme/themeProvider";

cssInterop(Pressable, { className: "style" });
cssInterop(Check, { className: "style" });

export type RadioVariant = "default" | "error";
export type RadioSize = "sm" | "md" | "lg";

const radioVariants = cva("flex-row items-center gap-2 select-none", {
  variants: {
    variant: {
      default: "",
      error: "opacity-80",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface RadioButtonProps extends VariantProps<typeof radioVariants> {
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
  labelClassName?: string;
  color?: string;
}

export const RadioButton = React.memo(function RadioButton({
  label,
  selected = false,
  disabled = false,
  onPress,
  variant = "default",
  size = "md",
  className,
  labelClassName,
  color = colors.brand,
}: RadioButtonProps) {
  const handlePress = () => {
    if (!disabled && onPress) onPress();
  };
  const { effective } = useTheme();
  const circleSize = useMemo(() => {
    switch (size) {
      case "sm":
        return 18;
      case "lg":
        return 26;
      default:
        return 22;
    }
  }, [size]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      className={cn(
        radioVariants({ variant, size }),
        Platform.OS === "web" && disabled && "cursor-not-allowed",
        className,
      )}
    >
      <View
        className={cn(
          `rounded-full border-2 items-center justify-center`,
          disabled && "opacity-50",
        )}
        style={{
          borderColor: color,
          backgroundColor: selected
            ? color
            : effective == "dark"
              ? colors.dark
              : colors.surface,
          width: circleSize,
          height: circleSize,
        }}
      >
        {selected && (
          <Check size={circleSize * 0.6} color="#FFFFFF" strokeWidth={3} />
        )}
      </View>

      {label && (
        <View>
          <Text
            className={cn(
              "text-fg dark:text-fg-dark",
              disabled && "opacity-70",
              labelClassName,
            )}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
});
