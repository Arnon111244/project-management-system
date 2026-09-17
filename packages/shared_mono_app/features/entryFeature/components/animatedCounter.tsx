"use client";

import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  type StyleProp,
  type TextStyle,
} from "react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";

type AnimatedCounterProps = {
  value: string;
  className?: string;
  style?: StyleProp<TextStyle>;
  delay?: number;
};

function parseCounterValue(raw: string) {
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { target: 0, suffix: raw, animatable: false };

  return {
    target: Number(match[1]),
    suffix: match[2] ?? "",
    animatable: true,
  };
}

export function AnimatedCounter({
  value,
  className,
  style,
  delay = 0,
}: AnimatedCounterProps) {
  const { target, suffix, animatable } = parseCounterValue(value);
  const animated = useRef(new Animated.Value(0)).current;
  const containerRef = useRef<React.ComponentRef<typeof View>>(null);
  const hasAnimated = useRef(false);
  const [display, setDisplay] = useState("0");
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    const id = animated.addListener(({ value: v }) => {
      setDisplay(String(Math.round(v)));
    });
    return () => animated.removeListener(id);
  }, [animated]);

  const runAnimation = () => {
    if (hasAnimated.current || !animatable) return;
    hasAnimated.current = true;

    Animated.timing(animated, {
      toValue: target,
      duration: 1400,
      delay,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (!animatable) return;

    if (!isWeb) {
      const timer = setTimeout(runAnimation, delay);
      return () => clearTimeout(timer);
    }

    const node = containerRef.current as unknown as Element | null;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [animatable, delay, isWeb, target]);

  if (!animatable) {
    return (
      <Text className={className} style={style}>
        {value}
      </Text>
    );
  }

  return (
    <View ref={containerRef}>
      <Text className={className} style={style}>
        {`${display}${suffix}`}
      </Text>
    </View>
  );
}
