import * as React from "react";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Button } from "ui/components/button";
import { cn } from "ui/utils/cn";

export type GroupButtonItem = {
  key: string;
  label: string;
  onPress?: () => void;
  icon: React.ReactNode;
  iconSize?: number; // default 22
  tint?: string; // icon color
  bgClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  labelClassName?: string;
  testID?: string;
};

export type GroupButtonsProps = {
  items: GroupButtonItem[];
  circleSize?: number; // default 56
  className?: string;
};

export function GroupButtons({
  items,
  circleSize = 56,
  className,
}: GroupButtonsProps) {
  // map numeric circle size to Tailwind classes
  const sizeClass =
    circleSize === 48
      ? "w-12 h-12"
      : circleSize === 56
        ? "w-14 h-14"
        : circleSize === 64
          ? "w-16 h-16"
          : `w-[${circleSize}px] h-[${circleSize}px]`;

  return (
    <View className={cn("w-full", className)}>
      <View className="flex-row justify-between">
        {items.map((it) => {
          const iconSize = it.iconSize ?? 22;
          const icon = React.isValidElement(it.icon)
            ? React.cloneElement(it.icon as any, {
                size: iconSize,
                color: it.tint ?? "#fff",
              })
            : it.icon;

          return (
            <View key={it.key} className="w-1/4 items-center">
              <Button
                variant="link"
                size="lg"
                onPress={it.onPress}
                disabled={it.disabled}
                loading={it.loading}
                className={cn(
                  "items-center justify-center rounded-full p-0",
                  sizeClass,
                  it.bgClassName ?? "bg-muted dark:bg-muted-dark",
                )}
                icon={icon}
                label={undefined}
                textClassName="hidden"
                accessibilityLabel={it.label}
                testID={it.testID}
              />
              <Text
                className={cn(
                  "mt-2 text-xs text-fg dark:text-fg-dark text-center",
                  it.labelClassName,
                )}
              >
                {it.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
