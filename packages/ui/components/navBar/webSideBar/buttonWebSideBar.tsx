import { memo } from "react";
import { Pressable } from "react-native";
import { cssInterop } from "nativewind";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";
import { colors } from "ui/theme";
import { useTheme } from "ui/theme/themeProvider";
import { NavItem, getNavLabel } from "../nav";
cssInterop(Pressable, { className: "style" });

type Props = {
  item: NavItem;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
  rightIcon?: React.ComponentType<any>;
};

function ButtonWebSideBarComponent({
  item,
  active,
  onPress,
  disabled,
  rightIcon: RightIcon,
}: Props) {
  const label = getNavLabel(item.labelKey);
  const Icon = item.icon;
  const { effective } = useTheme();

  const isDark = effective === "dark";

  return (
    <View className="rounded-xl overflow-hidden">
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: active, disabled }}
        className={cn(
          "group flex-row items-center gap-2 justify-between rounded-2xl px-3 py-2 transition-colors",
          active
            ? "bg-brand/10 dark:bg-brand/20"
            : "hover:bg-black/5 dark:hover:bg-white/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
        )}
        android_ripple={{ borderless: true, color: "rgba(0,0,0,0.06)" }}
        style={{
          pointerEvents: disabled ? "none" : "auto",
          minHeight: 48,
          borderRadius: 12,
        }}
      >
        <View className="flex-row items-center gap-2">
          <Icon
            size={22}
            color={active ? colors.brand : isDark ? colors.white : colors.fg}
          />
          <Text
            numberOfLines={1}
            className={cn(
              "block text-sm font-medium",
              active
                ? "text-brand dark:text-brand"
                : "text-fg/80 dark:text-white/80",
            )}
          >
            {label}
          </Text>
        </View>
        {RightIcon && (
          <RightIcon size={16} className="text-fg/60 dark:text-white/60" />
        )}
      </Pressable>
    </View>
  );
}

export const ButtonWebSideBar = memo(ButtonWebSideBarComponent);
ButtonWebSideBar.displayName = "ButtonWebSideBar";
