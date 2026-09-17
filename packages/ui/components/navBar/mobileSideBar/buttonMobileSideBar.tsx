import { memo } from "react";
import { Pressable } from "react-native";
import { cssInterop } from "nativewind";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { useTheme } from "ui/theme/themeProvider";
import { cn } from "ui/utils/cn";
import { colors } from "ui/theme";
import { NavItem, getNavLabel } from "../nav";
cssInterop(Pressable, { className: "style" });

type Props = {
  item: NavItem;
  active: boolean;
  layout: "side" | "bottom";
  onPress: () => void;
  disabled?: boolean;
  rightIcon?: React.ComponentType<any>;
};

function ButtonMobileSideBarComponent({
  item,
  active,
  onPress,
  disabled,
  rightIcon: RightIcon,
}: Props) {
  const label = getNavLabel(item.labelKey);
  const Icon = item.icon;

  const { effective: mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }}
      className={cn(
        "flex-row items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors",
        active ? "bg-[#EFF5F5] dark:bg-[#1F1F1F]" : "bg-transparent",
        "hover:bg-brand/15 dark:hover:bg-brand/25 active:opacity-90",
      )}
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Icon
          size={20}
          color={active ? colors.brand : isDark ? colors.white : colors.fg}
        />

        <Text
          numberOfLines={1}
          className={cn(
            "text-sm font-medium",
            active
              ? "text-brand dark:text-brand"
              : "text-fg/80 dark:text-white/80",
          )}
        >
          {label}
        </Text>
      </View>

      {RightIcon && (
        <RightIcon
          size={16}
          color={active ? colors.brand : isDark ? colors.white : colors.fg}
          className="text-fg/60 dark:text-white/60"
        />
      )}
    </Pressable>
  );
}

export const ButtonMobileSideBar = memo(ButtonMobileSideBarComponent);
ButtonMobileSideBar.displayName = "ButtonMobileSideBar";
