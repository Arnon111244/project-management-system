import React, { forwardRef, memo, useRef, useMemo } from "react";
import { Platform, Pressable } from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";
import { useTheme } from "ui/theme/themeProvider";
import { WebDatePicker } from "./web/WebDatePicker";
import { NativeDatePickerModal } from "./native/NativeDatePickerModal";
import { useIsOpenControlled } from "./hooks/useIsOpenControlled";
import { useAnchorRect } from "./hooks/useAnchorRect";
import { DatePickerProps } from "./utils/datePickerTypes";

export const DatePickerComponent = forwardRef<any, DatePickerProps>(
  (
    {
      error,
      label,
      required,
      layout = "stacked",
      labelWidthClassName = "w-28",
      inputWrapperClassName = "flex-1",
      className,
      placeholder = "Select date...",
      selectedDate,
      onDateChange,
      disabled,
      minYear = 1900,
      maxYear = new Date().getFullYear(),
    },
    ref,
  ) => {
    const { open, openPicker, closePicker } = useIsOpenControlled();
    const { effective } = useTheme();
    const triggerRef = useRef<any>(null);
    const { anchor, updateAnchorRect } = useAnchorRect(triggerRef);

    const isDisabled = !!disabled;
    const displayText = selectedDate
      ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
      : placeholder;

    const androidRippleConfig = useMemo(
      () =>
        Platform.OS === "android"
          ? {
              color:
                effective === "dark"
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.08)",
              borderless: false,
            }
          : undefined,
      [effective],
    );
    const helpTextClass = React.useMemo(
      () =>
        cn(
          "mt-1 text-xs",
          error
            ? "text-danger dark:text-danger"
            : "text-fg/60 dark:text-fg-dark/60",
        ),
      [error],
    );
    const triggerClasses = useMemo(
      () =>
        cn(
          "relative z-10 flex flex-row items-center w-full rounded-md h-10 px-3 text-base md:text-sm text-fg dark:text-fg-dark bg-white dark:bg-charcoal border border-border dark:border-border-dark",
          "web:[box-shadow:0_1px_2px_rgba(0,0,0,0.05)] web:focus:[box-shadow:0_0_0_3px_rgba(163,163,163,0.4),0_1px_2px_rgba(0,0,0,0.05)]",
          "web:[outline:none]",
          className,
        ),
      [isDisabled, className],
    );

    const renderDatePicker = () =>
      Platform.OS === "web" ? (
        <WebDatePicker
          selectedDate={selectedDate!}
          onDateChange={onDateChange!}
          onClose={closePicker}
          minYear={minYear}
          maxYear={maxYear}
        />
      ) : (
        <NativeDatePickerModal
          open={open}
          onClose={closePicker}
          selectedDate={selectedDate!}
          onDateChange={onDateChange!}
          minYear={minYear}
          maxYear={maxYear}
          isRTL={false}
          rippleConfig={androidRippleConfig}
          theme={effective}
        />
      );

    const body = (
      <View className="w-full">
        {!!label && (
          <Text className="block text-sm font-medium text-fg dark:text-fg-dark mb-1">
            {label}
            {required && (
              <Text className="text-danger dark:text-danger ps-0.5">*</Text>
            )}
          </Text>
        )}

        <Pressable
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref && typeof ref === "object")
              (ref as any).current = node;
          }}
          disabled={isDisabled || open}
          className={triggerClasses}
          accessibilityRole="button"
          onPress={() => {
            if (isDisabled) return;
            if (Platform.OS === "web") updateAnchorRect();
            openPicker();
          }}
        >
          <View className="flex-1">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className={cn(
                "text-base md:text-sm leading-none text-fg dark:text-fg-dark py-2",
                !selectedDate && "opacity-60",
              )}
              style={{
                writingDirection: "ltr",
                textAlign: "left",
              }}
            >
              {displayText}
            </Text>
          </View>
        </Pressable>

        {open && renderDatePicker()}
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
                <Text className="text-sm font-medium text-fg dark:text-fg-dark">
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
  },
);

DatePickerComponent.displayName = "DatePicker";
export const DatePicker2 = memo(DatePickerComponent);
