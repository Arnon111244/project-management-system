import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";

type Props = {
  label?: string;
  required?: boolean;
  isRTL: boolean;
  isDisabled: boolean;
  triggerRef: any;
  triggerClasses: string;
  displayText: string;
  selectedOption: any;
  effective: string;
  onPress: () => void;
  description?: string;
  showError: boolean;
  helpTextClass: string;
  error?: string;
  renderDropdown: () => React.ReactElement | null;
  open: boolean;
  layout: "horizontal" | "stacked";
  labelWidthClassName: string;
  inputWrapperClassName: string;
};

export const SelectBody = ({
  label,
  required,
  isRTL,
  isDisabled,
  triggerRef,
  triggerClasses,
  displayText,
  selectedOption,
  effective,
  onPress,
  description,
  showError,
  helpTextClass,
  error,
  renderDropdown,
  open,
  layout,
  labelWidthClassName,
  inputWrapperClassName,
}: Props) => {
  const body = (
    <View className="w-full">
      {!!label && (
        <Text
          className="block text-sm font-medium text-fg dark:text-fg-dark mb-1"
          style={{
            writingDirection: isRTL ? "rtl" : "ltr",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {label}
          {required && <Text className="text-danger ps-0.5">*</Text>}
        </Text>
      )}

      <Pressable
        ref={triggerRef}
        disabled={isDisabled || open}
        className={triggerClasses}
        accessibilityRole="button"
        onPress={onPress}
      >
        <View className="flex-1">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className={cn(
              "text-base md:text-sm leading-none",
              "text-fg dark:text-fg-dark",
              !selectedOption && "opacity-60",
            )}
            style={{
              writingDirection: isRTL ? "rtl" : "ltr",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {displayText}
          </Text>
        </View>

        <View className="h-full justify-start items-center p-2 pr-0">
          <Text
            aria-hidden
            className="text-lg leading-none text-fg/40 dark:text-fg-dark/40"
          >
            ⌄
          </Text>
        </View>
      </Pressable>

      {open && renderDropdown()}
      <View className="min-h-[20px] mt-1">
        <Text className={helpTextClass}>{error && error}</Text>
      </View>
    </View>
  );

  if (layout === "horizontal") {
    return (
      <View className="w-full">
        <View className="flex-row items-center gap-2">
          <View className={cn("h-10 justify-center", labelWidthClassName)}>
            {!!label && (
              <Text
                className="text-sm font-medium text-fg dark:text-fg-dark"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {label}
                {required && <Text className="text-danger ps-0.5">*</Text>}
              </Text>
            )}
          </View>
          <View className={cn("min-w-0 w-full", inputWrapperClassName)}>
            {body}
          </View>
        </View>
      </View>
    );
  }

  return body;
};
