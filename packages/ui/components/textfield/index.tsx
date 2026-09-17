import * as React from "react";
import { TextInput, TextInputProps, Platform, Pressable } from "react-native";
import { cssInterop } from "nativewind";
import { cn } from "ui/utils/cn";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Eye, EyeOff } from "lucide-react-native";
import { colors } from "ui/theme";

export type TextFieldLayout = "stacked" | "horizontal";

export interface TextFieldProps extends Omit<TextInputProps, "style"> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  layout?: TextFieldLayout;
  labelWidthClassName?: string;
  inputWrapperClassName?: string;
  hasError?: boolean;
  className?: string;
  placeholderFollowsLocale?: boolean;
  secureTextEntry?: boolean;
}

cssInterop(TextInput, { className: "style" });

const TextFieldComponent = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  TextFieldProps
>(
  (
    {
      label,
      description,
      error,
      required,
      layout = "stacked",
      labelWidthClassName = "w-28",
      inputWrapperClassName = "flex-1",
      className,
      hasError,
      editable = true,
      onFocus,
      onBlur,
      onChangeText,
      defaultValue = "",
      value,
      placeholderFollowsLocale = true,
      keyboardType = "default",
      secureTextEntry = false,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);
    const controlled = typeof value === "string";
    const initialHasText =
      (controlled ? value : defaultValue)?.toString().length > 0;
    const [uncontrolledHasText, setUncontrolledHasText] =
      React.useState<boolean>(!controlled && initialHasText);
    const hasText = controlled
      ? (value?.toString().length ?? 0) > 0
      : uncontrolledHasText;
    const textAlign: "left" | "right" = "left";
    const inputKey = placeholderFollowsLocale
      ? `tf-ltr-${hasText ? "v" : "p"}`
      : undefined;

    React.useEffect(() => {
      if (controlled) return;
      setUncontrolledHasText((defaultValue?.toString().length ?? 0) > 0);
    }, [controlled, defaultValue]);

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

    const handleChangeText = React.useCallback(
      (txt: string) => {
        if (!controlled) {
          setUncontrolledHasText(txt.length > 0);
        }
        onChangeText?.(txt);
      },
      [controlled, onChangeText],
    );

    const inputDirStyle = {
      writingDirection: "ltr" as const,
      textAlign: "left" as const,
    };
    const labelDirStyle = {
      writingDirection: "ltr" as const,
      textAlign: "left" as const,
    };
    const inputClasses = cn(
      "relative z-10",
      "block w-full rounded-md h-10 px-3",
      "ios:text-base ios:leading-5 ios:py-2.5",
      "web:py-2",
      !props.multiline &&
        "android:py-0 android:[textAlignVertical:center] android:[includeFontPadding:false]",
      props.multiline &&
        "android:py-2 android:[textAlignVertical:top] android:[includeFontPadding:false]",
      "md:text-sm text-fg dark:text-fg-dark placeholder:text-fg/60 dark:placeholder:text-fg-dark/60",
      isDisabled
        ? "bg-[#F2F4F7] border border-[#E5E5E5] text-slate-400 placeholder:text-slate-400 web:cursor-not-allowed dark:bg-muted-dark dark:border-border-dark dark:text-fg-dark/60 dark:placeholder:text-fg-dark/60"
        : "bg-surface dark:bg-charcoal border border-border dark:border-border-dark",
      !showError &&
        !isDisabled &&
        "focus:border-brand web:focus:[box-shadow:0_0_0_3px_rgba(2,192,206,0.4),0_1px_2px_rgba(0,0,0,0.05)]",
      showError &&
        "border-danger focus:border-danger web:focus:[box-shadow:0_0_0_3px_rgba(220,38,38,0.4),0_1px_2px_rgba(0,0,0,0.05)]",
      "outline-none focus:outline-none shadow-none",
      "web:[box-shadow:0_1px_2px_rgba(0,0,0,0.05)]",
      "web:[outline:none] web:focus:[outline:none]",
      className,
    );

    const helpTextClass = React.useMemo(
      () =>
        cn(
          "mt-1 text-[10px]",
          showError
            ? "text-danger dark:text-danger"
            : "text-fg/60 dark:text-fg-dark/60",
        ),
      [showError],
    );

    const nativeFocusRingClass = React.useMemo(
      () => cn("absolute -inset-[1px] rounded-[8px] z-0"),
      [showError],
    );

    const [showPassword, setShowPassword] = React.useState(false);

    const inputEl = (
      <View className="relative overflow-visible">
        {Platform.OS !== "web" && focused && !isDisabled && (
          <View
            style={{ pointerEvents: "none" }}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            className={nativeFocusRingClass}
          />
        )}

        <TextInput
          keyboardType={keyboardType}
          ref={ref}
          editable={editable}
          underlineColorAndroid="transparent"
          className={cn(inputClasses, secureTextEntry && "pe-10 ps-3")}
          {...(controlled ? { value } : { defaultValue })}
          style={inputDirStyle}
          accessibilityState={{ disabled: isDisabled }}
          aria-disabled={Platform.OS === "web" ? isDisabled : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            className="absolute top-0 bottom-0 justify-center z-20"
            style={{ right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="toggle password visibility"
          >
            {showPassword ? (
              <EyeOff size={18} color={colors.brand} />
            ) : (
              <Eye size={18} color={colors.brand} />
            )}
          </Pressable>
        )}
      </View>
    );

    return (
      <View className="w-full">
        {!!label && (
          <Text
            className="block text-sm font-medium mb-1 text-fg dark:text-fg-dark"
            style={labelDirStyle}
          >
            {label}
            {required && <Text className="text-danger ps-0.5">*</Text>}
          </Text>
        )}
        {inputEl}

        <View className="min-h-[20px] mt-1">
          <Text className={helpTextClass}>
            {showError ? error : (description ?? " ")}
          </Text>
        </View>
      </View>
    );
  },
);

TextFieldComponent.displayName = "TextField";
export const TextField = React.memo(TextFieldComponent);
