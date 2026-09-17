import React, { memo, useRef } from "react";
import { Platform, Pressable, ViewStyle, Animated } from "react-native";
import { cssInterop } from "nativewind";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";
import { colors } from "ui/theme";
import { useTheme } from "ui/theme/themeProvider";
import { NavItem, getNavLabel } from "../nav";
cssInterop(Pressable, { className: "style" });

export type NavBarTranslations = {
  home: string;
  portfolio: string;
  wallet: string;
  settings: string;
  contracts: string;
  pro: string;
  documentation: string;
  status: string;
  tierDiamond: string;
  action: string;
};

type Props = {
  item: NavItem;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
};

function TopButtonBarComponent({ item, active, onPress, disabled }: Props) {
  const label = getNavLabel(item.labelKey);
  const Icon = item.icon;

  const { effective } = useTheme();
  const isDark = effective === "dark";

  const translateY = useRef(new Animated.Value(0)).current;

  const handleHoverIn = () => {
    if (Platform.OS === "web") {
      Animated.spring(translateY, {
        toValue: -6,
        friction: 4,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleHoverOut = () => {
    if (Platform.OS === "web") {
      Animated.spring(translateY, {
        toValue: 0,
        friction: 4,
        useNativeDriver: true,
      }).start();
    }
  };

  const iconColor = active ? colors.brand : isDark ? colors.white : colors.fg;

  const basePressableStyle: ViewStyle = {
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    minHeight: 48,
    pointerEvents: disabled ? "none" : "auto",
  };

  return (
    <Animated.View
      style={
        item.isAnimationActive === false ? {} : { transform: [{ translateY }] }
      }
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: active, disabled }}
        className={cn(
          "group w-full items-center justify-center mx-2",
          "ring-0 shadow-none bg-danger",
        )}
        style={basePressableStyle}
        {...(Platform.OS === "android"
          ? { android_ripple: { color: "transparent", borderless: true } }
          : {})}
      >
        <Icon size={22} color={iconColor} />
      </Pressable>
    </Animated.View>
  );
}

export const TopButtonBar = memo(TopButtonBarComponent);
TopButtonBar.displayName = "TopButtonBar";
