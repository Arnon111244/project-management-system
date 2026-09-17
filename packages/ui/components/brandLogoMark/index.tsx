import React, { memo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";

type BrandLogoMarkProps = {
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
};

function BrandLogoMarkComponent({
  className,
  textClassName,
  style,
}: BrandLogoMarkProps) {
  return (
    <View
      style={style}
      className={cn(
        "h-8 w-8 rounded-xl bg-brand items-center justify-center",
        className,
      )}
    >
      <Text className={cn("text-white font-bold text-sm", textClassName)}>
        N
      </Text>
    </View>
  );
}

export const BrandLogoMark = memo(BrandLogoMarkComponent);
BrandLogoMark.displayName = "BrandLogoMark";
