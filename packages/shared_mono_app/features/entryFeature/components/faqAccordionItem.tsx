"use client";

import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { ChevronDown } from "lucide-react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { HoverBorderSurface } from "./HoverBorderSurface";
import { NEURAL } from "ui/theme/neuralRuntime";

const ANIM_DURATION = 280;

type FaqAccordionItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

/** Animated accordion — desktop web only (see FaqSection). */
export function FaqAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const progress = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    if (contentHeight === 0) return;

    Animated.timing(progress, {
      toValue: isOpen ? 1 : 0,
      duration: ANIM_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isOpen, contentHeight, progress]);

  const animatedHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(contentHeight, 1)],
  });

  const contentOpacity = progress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.5, 1],
  });

  const contentMargin = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  const chevronRotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <HoverBorderSurface
      onPress={onToggle}
      focusable={false}
      accent={NEURAL.cyan}
      baseBorder={isOpen ? NEURAL.borderGlow : NEURAL.border}
      className="relative rounded-2xl p-5 overflow-hidden [overflow-anchor:none]"
    >
      <View className="flex-row items-center justify-between gap-3">
        <Text
          className="text-sm font-semibold flex-1"
          style={{ color: NEURAL.text }}
        >
          {question}
        </Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <ChevronDown size={18} color={NEURAL.cyan} />
        </Animated.View>
      </View>

      <View
        pointerEvents="none"
        className="absolute opacity-0 left-5 right-5"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        onLayout={(event) => {
          const nextHeight = event.nativeEvent.layout.height;
          if (nextHeight > 0 && nextHeight !== contentHeight) {
            setContentHeight(nextHeight);
          }
        }}
      >
        <Text
          className="text-sm leading-6"
          style={{ color: NEURAL.textSecondary }}
        >
          {answer}
        </Text>
      </View>

      <Animated.View
        style={{
          height: animatedHeight,
          opacity: contentOpacity,
          marginTop: contentMargin,
          overflow: "hidden",
        }}
      >
        <Text
          className="text-sm leading-6"
          style={{ color: NEURAL.textSecondary }}
        >
          {answer}
        </Text>
      </Animated.View>
    </HoverBorderSurface>
  );
}
