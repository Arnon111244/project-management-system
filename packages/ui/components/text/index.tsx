import React from "react";
import { Platform, TextStyle } from "react-native";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { cssInterop } from "nativewind";
import { cn } from "ui/utils/cn";

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  className?: string;
}

cssInterop(RNText, { className: "style" });

export const Text = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  TextProps
>(({ children, className, style, ...props }, ref) => {
  const isWeb = Platform.OS === "web";

  const defaultFont: TextStyle | undefined = isWeb
    ? {
        fontFamily:
          'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      }
    : undefined;

  return (
    <RNText
      ref={ref}
      className={cn("text-fg dark:text-white", className)}
      style={[defaultFont, style]}
      {...props}
    >
      {children}
    </RNText>
  );
});

Text.displayName = "Text";
