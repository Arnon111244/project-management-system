import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { cssInterop } from "nativewind";

import { cn } from "ui/utils/cn";
import { useNeuralPalette } from "ui/theme/themeProvider";
import { isWeb } from "./platformStyles";

import { useHoverBorder } from "../hooks/useHoverBorder";

cssInterop(Pressable, { className: "style" });

type HoverBorderSurfaceProps = Omit<PressableProps, "style"> & {
  children: ReactNode;
  accent?: string;
  baseBorder?: string;
  backgroundColor?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function HoverBorderSurface({
  children,
  accent,
  baseBorder,
  backgroundColor,
  className,
  style,
  onPress,
  disabled,
  ...rest
}: HoverBorderSurfaceProps) {
  const neural = useNeuralPalette();
  const resolvedAccent = accent ?? neural.borderGlow;
  const resolvedBase = baseBorder ?? neural.border;
  const resolvedBackground = backgroundColor ?? neural.tile;
  const { borderColor, hoverHandlers } = useHoverBorder({
    accent: resolvedAccent,
    base: resolvedBase,
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      {...hoverHandlers}
      {...rest}
      className={cn(isWeb && "transition-colors duration-200", className)}
      style={[
        { backgroundColor: resolvedBackground },
        style,
        {
          borderColor,
          borderWidth: 1,
          borderStyle: "solid",
        },
      ]}
    >
      {children}
    </Pressable>
  );
}
