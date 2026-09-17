import React from "react";
import { Pressable } from "react-native";

import { colors } from "ui/theme";
import { BrandLogoMark } from "ui/components/brandLogoMark";
import { Image } from "ui/components/image";
import { View } from "ui/components/view";

interface AvatarProps {
  src?: string;
  size?: number;
  ringColor?: string;
  offsetColor?: string;
}

export const AvatarProfile = ({
  src,
  size = 20,
  ringColor = colors.brand,
  offsetColor = "#ffffff",
}: AvatarProps) => {
  return (
    <View className="items-center justify-center py-1 z-[999] h-[30px] mb-2">
      <Pressable disabled>
        <View
          style={{
            width: size + 6,
            height: size + 6,
            borderRadius: 9999,
            borderWidth: 1.5,
            borderColor: ringColor,
            padding: 2,
            backgroundColor: offsetColor,
          }}
          className="items-center justify-center"
        >
          {src ? (
            <Image
              src={src}
              resizeMode="cover"
              style={{ width: size, height: size, borderRadius: size / 2 }}
            />
          ) : (
            <BrandLogoMark
              className="rounded-full"
              style={{ width: size, height: size }}
              textClassName={size >= 40 ? "text-lg" : "text-xs"}
            />
          )}
        </View>
      </Pressable>
    </View>
  );
};
