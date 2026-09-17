import { memo } from "react";
import { Platform, Pressable, ViewStyle } from "react-native";
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
  layout: "side" | "bottom";
  onPress: () => void;
  disabled?: boolean;
};

function BottomButtonBarComponent({
  item,
  active,
  layout,
  onPress,
  disabled,
}: Props) {
  const label = getNavLabel(item.labelKey);
  const Icon = item.icon;

  const { effective } = useTheme();

  const isDark = effective === "dark";

  const isWeb = Platform.OS === "web";

  const webFocusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

  const basePressableStyle: ViewStyle = {
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    minHeight: 48,
    pointerEvents: disabled ? "none" : "auto",
  };

  if (layout === "bottom") {
    const iconColor = active ? colors.brand : isDark ? colors.white : colors.fg;
    const labelClass = active
      ? "!text-brand dark:!text-brand"
      : "text-black dark:white";

    const labelNativeStyle =
      !isWeb && active ? { color: colors.brand } : undefined;

    return (
      <View className="flex-1 rounded-xl overflow-hidden items-center justify-center">
        <Pressable
          onPress={onPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ selected: active, disabled }}
          className={cn(
            "group w-full items-center justify-center py-2.5 transition-colors",
            !isWeb && "ring-0 shadow-none bg-transparent",
            isWeb && webFocusRing,
          )}
          style={basePressableStyle}
          {...(Platform.OS === "android"
            ? { android_ripple: { color: "transparent", borderless: true } }
            : {})}
        >
          <Icon size={Platform.OS === "web" ? 23 : 20} color={iconColor} />

          <Text
            numberOfLines={1}
            className={cn(
              "mt-1 text-[13px] leading-4 font-bold transition-colors",
              labelClass,
              "group-hover:text-brand",
            )}
            style={labelNativeStyle}
          >
            {label}
          </Text>

          <View
            className={cn(
              "mt-1 h-[3px] w-6 rounded-full transition-colors",
              active ? "bg-brand" : "bg-transparent",
              !active && "group-hover:bg-brand",
            )}
          />
        </Pressable>
      </View>
    );
  }
}

export const BottomButtonBar = memo(BottomButtonBarComponent);
BottomButtonBar.displayName = "BottomButtonBar";
