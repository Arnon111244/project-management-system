import React, { memo, useRef, useEffect } from "react";
import { Pressable, Animated } from "react-native";
import { View } from "ui/components/view";
import { X, Menu } from "lucide-react-native";
import { colors } from "ui/theme";

interface HamburgerToggleProps {
  isOpen: boolean;
  onToggle?: (isOpen: boolean) => void;
  size?: number;
  color?: string;
}

function HamburgerToggleComponent({
  isOpen,
  onToggle,
  size = 40,
  color = colors.brand,
}: HamburgerToggleProps) {
  const anim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const handleToggle = () => {
    onToggle?.(!isOpen);
  };

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const hamburgerOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const closeOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      onPress={handleToggle}
      accessibilityRole="button"
      className="active:opacity-70"
      style={{ zIndex: 100 }}
    >
      <View
        className="relative items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Animated.View
          style={{
            opacity: hamburgerOpacity,
            transform: [{ rotate }],
            position: "absolute",
          }}
        >
          <Menu size={size * 0.7} color={color} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: closeOpacity,
            transform: [{ rotate }],
            position: "absolute",
          }}
        >
          <X size={size * 0.7} color={color} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

export const HamburgerToggle = memo(HamburgerToggleComponent);
