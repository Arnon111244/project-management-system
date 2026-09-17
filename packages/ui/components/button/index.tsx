import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Platform,
  Animated,
  Easing,
  Pressable,
  type PressableProps,
  type TextStyle,
} from "react-native";
import { cssInterop } from "nativewind";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react-native";
import { cn } from "ui/utils/cn";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { colors } from "ui/theme";
import { useTheme } from "ui/theme/themeProvider";

cssInterop(Pressable, { className: "style" });
cssInterop(Loader2, { className: "style" });

export type ButtonVariant =
  | "primary"
  | "link"
  | "ghost"
  | "destructive"
  | "outline";

export type ButtonSize = "sm" | "lg" | "icon-sm" | "icon-lg";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-full w-full transition-[box-shadow,opacity,filter,background-color] duration-150 focus-visible:outline-none gap-2 select-none group",
  {
    variants: {
      variant: {
        primary:
          "bg-brand hover:bg-brand-hover dark:bg-brand dark:hover:bg-brand-hover focus-visible:shadow-[0_0_0_3px_rgba(163,163,163,0.5)]",

        destructive:
          "bg-danger dark:bg-danger hover:bg-[#ff3700] focus-visible:shadow-[0_0_0_3px_rgba(163,163,163,0.5)]",
        outline:
          "bg-surface dark:bg-black border border-brand dark:border-brand hover:bg-brand dark:hover:bg-brand",
        ghost:
          "bg-transparent hover:bg-light-cyan dark:hover:bg-black focus-visible:border focus-visible:border-border dark:focus-visible:border-border-dark",
        link: "bg-transparent",
      },
      size: {
        sm: "h-9 px-4",
        lg: "h-10 px-5",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-10 w-10",
      },
      mutedState: { none: "", muted: "opacity-70" },
      disabled: { false: "", true: "" },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
      mutedState: "none",
      disabled: false,
    },
    compoundVariants: [
      {
        variant: "primary",
        disabled: true,
        class:
          "bg-gray dark:bg-brand hover:bg-gray dark:hover:bg-brand focus-visible:shadow-none",
      },

      {
        variant: "destructive",
        disabled: true,
        class: "hover:brightness-100 focus-visible:shadow-none",
      },
      {
        variant: "outline",
        disabled: true,
        class:
          "bg-surface dark:bg-black text-fg dark:text-fg-dark border border-border dark:border-border-dark hover:bg-surface dark:hover:bg-black focus-visible:shadow-none",
      },
      {
        variant: "ghost",
        disabled: true,
        class:
          "bg-transparent hover:bg-transparent focus-visible:border-0 focus-visible:shadow-none",
      },
      {
        variant: "link",
        disabled: true,
        class: "bg-transparent focus-visible:shadow-none",
      },

      {
        variant: "primary",
        size: "lg",
        class: "shadow-lg shadow-brand/50 dark:shadow-brand-dark/50",
      },
    ],
  },
);

const labelVariants = cva("font-medium", {
  variants: {
    variant: {
      primary: "text-white",
      destructive: "text-white",
      outline: "text-fg dark:text-fg-dark",
      ghost: "text-fg dark:text-fg-dark",
      link: "text-link dark:text-brand-dark underline underline-offset-4",
    },
    size: {
      sm: "text-sm leading-[14px]",
      lg: "text-base leading-[16px]",
      "icon-sm": "text-sm leading-[14px]",
      "icon-lg": "text-base leading-[16px]",
    },
  },
  defaultVariants: { variant: "primary", size: "sm" },
});

interface ButtonProps
  extends Omit<PressableProps, "onPress">, VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  textStyle?: TextStyle;
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disableWhileLoading?: boolean;
  isPressed?: boolean;
  onPress?: () => void;
}

function useSpin(playing: boolean, duration = 900) {
  const val = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!playing) {
      val.stopAnimation(() => val.setValue(0));
      return;
    }

    const loop = Animated.loop(
      Animated.timing(val, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== "web",
      }),
    );

    loop.start();
    return () => loop.stop();
  }, [playing, duration, val]);

  return val.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
}

const ButtonComponent = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      children,
      className,
      textClassName,
      textStyle,
      variant = "primary",
      size = "sm",
      icon,
      rightIcon,
      label,
      loading = false,
      disableWhileLoading = false,
      isPressed = false,
      disabled,
      onPress,
      ...props
    },
    ref,
  ) => {
    const rotation = useSpin(loading);
    const { effective: mode } = useTheme();
    const isDark = mode === "dark";

    const isIconOnly = useMemo(
      () => !label && !children && !!icon,
      [label, children, icon],
    );

    const finalSize: ButtonSize = useMemo(() => {
      if (isIconOnly) return size === "lg" ? "icon-lg" : "icon-sm";
      return (size ?? "sm") as ButtonSize;
    }, [isIconOnly, size]);

    const isDisabled = useMemo(
      () => Boolean(disabled) || (loading && disableWhileLoading),
      [disabled, loading, disableWhileLoading],
    );

    const mutedState: "muted" | "none" = useMemo(
      () => (isDisabled || isPressed ? "muted" : "none"),
      [isDisabled, isPressed],
    );

    const spinnerColor = useMemo(() => {
      if (variant === "primary" || variant === "destructive")
        return colors.white;
      if (variant === "link") return isDark ? colors.brandDark : colors.brand;
      return isDark ? colors.fgDark : colors.fg;
    }, [variant, isDark]);

    const content = useMemo(() => {
      const base = label ?? children;
      if (typeof base === "string") {
        return (
          <Text
            className={cn(
              labelVariants({ variant, size: finalSize }),
              "leading-none",
              textClassName ?? "",
              "text-[14px] mx-1",
            )}
            style={textStyle}
          >
            {base}
          </Text>
        );
      }
      return base;
    }, [label, children, variant, finalSize, textClassName]);

    const webDisabledSurface =
      Platform.OS === "web" && isDisabled
        ? ({ cursor: "not-allowed", pointerEvents: "auto" } as const)
        : undefined;

    const mergedStyle = useMemo(() => {
      const base = (props as any).style;
      return Array.isArray(base)
        ? [...base, webDisabledSurface]
        : [base, webDisabledSurface];
    }, [(props as any).style, webDisabledSurface]);

    const handlePress = useCallback(() => {
      if (!isDisabled && onPress) onPress();
    }, [isDisabled, onPress]);

    const classes = useMemo(
      () =>
        cn(
          buttonVariants({
            variant,
            size: finalSize,
            mutedState,
            disabled: isDisabled,
          }),
          Platform.OS === "web" && isDisabled && "cursor-not-allowed",
          className,
        ),
      [variant, finalSize, mutedState, isDisabled, className],
    );

    const a11yState = useMemo(
      () => ({ busy: loading, disabled: isDisabled }),
      [loading, isDisabled],
    );

    const hitSlop =
      Platform.OS !== "web"
        ? ({ top: 10, bottom: 10, left: 10, right: 10 } as const)
        : undefined;

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        onPress={handlePress}
        className={classes}
        accessibilityRole="button"
        accessibilityState={a11yState}
        style={mergedStyle}
        {...(hitSlop ? { hitSlop } : {})}
        {...props}
      >
        <View className="flex-row justify-center items-center">
          {content}
          {loading ? (
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Loader2 size={12} color={spinnerColor} />
            </Animated.View>
          ) : (
            icon
          )}

          {!loading && rightIcon}
        </View>
      </Pressable>
    );
  },
);

export const Button = React.memo(ButtonComponent);
Button.displayName = "Button";

export const GlassButton: React.FC<ButtonProps> = ({
  textClassName,
  className,
  ...props
}) => (
  <Button
    className={`
      bg-white/20 dark:bg-black/20 
      backdrop-blur-lg 
      border border-white/30 dark:border-gray-700/30
      ${className || ""}
    `}
    textClassName={`text-white dark:text-gray-200 ${textClassName}`}
    {...props}
  />
);

export const GlowButton: React.FC<ButtonProps> = ({
  textClassName,
  className,
  ...props
}) => (
  <Button
    variant="outline"
    className={`border-2 border-blue-400 shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50 ${className}`}
    textClassName={`text-blue-600 dark:text-blue-400 ${textClassName}`}
    {...props}
  />
);

export const ProgressButton: React.FC<
  ButtonProps & {
    progress?: number;
    className?: string;
    textClassName?: string;
  }
> = ({
  progress,
  className,
  textClassName,
  label = "Processing...",
  ...props
}) => {
  const showProgress = typeof progress === "number";

  return (
    <Pressable
      className={`relative overflow-hidden rounded-full bg-blue-500 h-10 px-5 justify-center w-full ${className}`}
    >
      {showProgress && (
        <View
          className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      )}
      <Text
        className={`text-white font-medium relative z-10 text-center ${textClassName}`}
      >
        {showProgress ? `${label} ${progress}%` : label}
      </Text>
    </Pressable>
  );
};
