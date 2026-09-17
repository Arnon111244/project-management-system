import React, { memo, useEffect, useRef } from "react";
import { Pressable, Animated } from "react-native";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";

interface SwitchButtonProps {
  selected: boolean;
  disabled: boolean;
  onToggleOff: () => void;
  color?: string;
  label?: string;
}

function SwitchButtonComponent({
  selected,
  disabled,
  onToggleOff,
  color,
  label = "",
}: SwitchButtonProps) {
  const anim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: selected ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  return (
    <View className="px-0 py-3 flex-row items-center justify-start">
      <Pressable
        onPress={onToggleOff}
        disabled={disabled}
        style={{
          height: 20,
          width: 36,
          borderRadius: 999,
          padding: 2,
          backgroundColor: selected ? color : "#A3A3A3",
          opacity: disabled ? 0.6 : 1,
        }}
        accessibilityRole="switch"
        aria-checked={selected}
      >
        <Animated.View
          style={{
            height: 16,
            width: 15,
            borderRadius: 999,
            backgroundColor: "#FCFCFC",
            transform: [{ translateX }],
          }}
        />
      </Pressable>
      {label ? <Text className="mx-2">{label}</Text> : null}
    </View>
  );
}

export const SwitchButton = memo(SwitchButtonComponent);
