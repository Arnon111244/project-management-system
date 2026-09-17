import * as React from "react";
import { TextInput, TextInputProps, Platform } from "react-native";
import { cssInterop } from "nativewind";
import { cn } from "ui/utils/cn";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { colors } from "ui/theme";

cssInterop(TextInput, { className: "style" });

export interface TextAreaProps extends Omit<TextInputProps, "style"> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  hasError?: boolean;
  className?: string;
}

const TextAreaComponent = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  TextAreaProps
>(
  (
    {
      label,
      description,
      error,
      required,
      className,
      hasError,
      editable = true,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);

    const showError = !!error || !!hasError;
    const isDisabled = editable === false;

    const handleFocus = React.useCallback(
      (e: any) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = React.useCallback(
      (e: any) => {
        setFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const inputDirStyle = {
      writingDirection: "ltr" as const,
      textAlign: "left" as const,
    };

    const inputClasses = cn(
      "relative z-10 w-full rounded-md px-3 py-2 min-h-[110px]",
      "text-sm md:text-sm text-fg dark:text-fg-dark",
      "placeholder:text-fg/60 dark:placeholder:text-fg-dark/60",
      isDisabled
        ? "bg-[#F2F4F7] border border-[#E5E5E5] text-slate-400"
        : "bg-surface dark:bg-charcoal border border-border dark:border-border-dark",
      "outline-none focus:outline-none shadow-none",
      "web:[box-shadow:0_1px_2px_rgba(0,0,0,0.05)]",
      "web:[outline:none] web:focus:[outline:none]",
      className,
    );

    const focusStyle = React.useMemo(
      () => ({
        ...inputDirStyle,
        ...(showError
          ? { borderColor: colors.danger }
          : focused && !isDisabled
            ? {
                borderColor: colors.brand,
                ...(Platform.OS === "web"
                  ? {
                      boxShadow:
                        "0 0 0 3px rgba(2,192,206,0.4), 0 1px 2px rgba(0,0,0,0.05)",
                    }
                  : {}),
              }
            : {}),
      }),
      [focused, inputDirStyle, isDisabled, showError],
    );

    const helpTextClass = cn(
      "mt-1 text-xs",
      showError
        ? "text-danger dark:text-danger"
        : "text-fg/60 dark:text-fg-dark/60",
    );

    return (
      <View className="w-full">
        {!!label && (
          <Text className="text-sm font-medium mb-1">
            {label}
            {required && <Text className="text-danger"> *</Text>}
          </Text>
        )}

        <View className="relative overflow-visible">
          {Platform.OS !== "web" && focused && !isDisabled && !showError ? (
            <View
              pointerEvents="none"
              accessible={false}
              importantForAccessibility="no-hide-descendants"
              className="absolute -inset-[1px] rounded-[8px] z-0 border-2"
              style={{ borderColor: colors.brand }}
            />
          ) : null}

          <TextInput
            ref={ref}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            underlineColorAndroid="transparent"
            editable={editable}
            className={inputClasses}
            style={focusStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </View>

        <View className="min-h-[20px] mt-1">
          <Text className={helpTextClass}>
            {showError ? error : (description ?? " ")}
          </Text>
        </View>
      </View>
    );
  },
);

TextAreaComponent.displayName = "TextArea";

export const TextArea = React.memo(TextAreaComponent);
