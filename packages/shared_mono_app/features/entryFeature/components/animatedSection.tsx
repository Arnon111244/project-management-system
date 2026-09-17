"use client";

import React, { useCallback, useEffect, useRef, type ReactNode } from "react";
import { Animated, Platform, type ViewStyle } from "react-native";

import { View } from "ui/components/view";

import { useLandingSectionRef } from "../hooks/useLandingSectionRef";
import {
  ENTRY_ANIM,
  getInitialOffset,
  type AnimationVariant,
} from "./entryAnimations";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
  delay?: number;
  nativeID?: string;
  variant?: AnimationVariant;
  duration?: number;
};

function AnimatedSectionStatic({
  children,
  className,
  style,
  nativeID,
}: AnimatedSectionProps) {
  const sectionRef = useLandingSectionRef(nativeID);
  const content = React.Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );

  return (
    <View
      ref={sectionRef}
      nativeID={nativeID}
      className={className}
      style={style}
      collapsable={false}
    >
      {content}
    </View>
  );
}

function AnimatedSectionWeb({
  children,
  className,
  style,
  delay = 0,
  nativeID,
  variant = "fadeUp",
  duration = ENTRY_ANIM.duration,
}: AnimatedSectionProps) {
  const initial = getInitialOffset(variant);
  const content = React.Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );

  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(initial.x)).current;
  const translateY = useRef(new Animated.Value(initial.y)).current;
  const scale = useRef(new Animated.Value(initial.scale)).current;
  const containerRef = useRef<React.ComponentRef<typeof View>>(null);
  const sectionRef = useLandingSectionRef(nativeID);
  const hasAnimated = useRef(false);

  const setContainerRef = useCallback(
    (node: React.ComponentRef<typeof View> | null) => {
      containerRef.current = node;
      sectionRef(node);
    },
    [sectionRef],
  );

  const runAnimation = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        ...ENTRY_ANIM.spring,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        ...ENTRY_ANIM.spring,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        ...ENTRY_ANIM.spring,
      }),
    ]).start();
  };

  useEffect(() => {
    const node = containerRef.current as unknown as Element | null;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        runAnimation();
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, duration]);

  return (
    <View
      ref={setContainerRef}
      nativeID={nativeID}
      className={className}
      style={style}
      collapsable={false}
    >
      <Animated.View
        style={{
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
          width: "100%",
        }}
      >
        {content}
      </Animated.View>
    </View>
  );
}

export function AnimatedSection(props: AnimatedSectionProps) {
  if (Platform.OS !== "web") {
    return <AnimatedSectionStatic {...props} />;
  }
  return <AnimatedSectionWeb {...props} />;
}
