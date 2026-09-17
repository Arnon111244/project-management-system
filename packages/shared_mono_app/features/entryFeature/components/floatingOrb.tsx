"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, Platform } from "react-native";

import { View } from "ui/components/view";

type FloatingOrbProps = {
  children?: ReactNode;
  className?: string;
  style?: object;
  amplitude?: number;
  amplitudeX?: number;
  pulseScale?: number;
  rotateDeg?: number;
  duration?: number;
  delay?: number;
};

export function FloatingOrb({
  children,
  className,
  style,
  amplitude = 14,
  amplitudeX = 0,
  pulseScale = 0,
  rotateDeg = 0,
  duration = 4200,
  delay = 0,
}: FloatingOrbProps) {
  const isWeb = Platform.OS === "web";
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isWeb) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, duration, delay, isWeb]);

  if (!isWeb) {
    return (
      <View className={className} style={style}>
        {children}
      </View>
    );
  }

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, amplitude],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, amplitudeX, 0],
  });

  const scale = pulseScale
    ? progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1 + pulseScale, 1],
      })
    : 1;

  const rotate = rotateDeg
    ? progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", `${rotateDeg}deg`],
      })
    : "0deg";

  return (
    <Animated.View
      className={className}
      style={[
        style,
        { transform: [{ translateX }, { translateY }, { scale }, { rotate }] },
      ]}
    >
      {children ?? <View className={className} style={style} />}
    </Animated.View>
  );
}
