"use client";

import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, useWindowDimensions } from "react-native";
import { Menu, X } from "lucide-react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { BrandLogoMark } from "ui/components/brandLogoMark";
import { cn } from "ui/utils/cn";

import { BRAINWAVE_SECTION_IDS } from "../brainwaveTheme";
import { NEURAL } from "ui/theme/neuralRuntime";
import { isWeb } from "./platformStyles";
import { NAVBAR_HEIGHT } from "../hooks/useLandingHeaderOffset";

import { scrollToSection } from "../utils/scrollToSection";

export function Navbar() {
  const { width } = useWindowDimensions();
  const showDesktopNav = width >= 1024;
  const showBrandName = width >= 400;
  const compactNav = width >= 1024 && width < 1280;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

  const navItems = [
    { label: "Start", sectionId: BRAINWAVE_SECTION_IDS.quickstart },
    { label: "Structure", sectionId: BRAINWAVE_SECTION_IDS.showcase },
    { label: "Packages", sectionId: BRAINWAVE_SECTION_IDS.platform },
    { label: "Versions", sectionId: BRAINWAVE_SECTION_IDS.versions },
    { label: "FAQ", sectionId: BRAINWAVE_SECTION_IDS.faq },
  ];

  useEffect(() => {
    if (!showDesktopNav) setMobileMenuOpen(false);
  }, [showDesktopNav]);

  useEffect(() => {
    if (!isWeb || typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    Animated.timing(menuAnimation, {
      toValue: mobileMenuOpen ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [mobileMenuOpen, menuAnimation]);

  const barBackground =
    scrolled || mobileMenuOpen ? NEURAL.chrome : NEURAL.dock;

  return (
    <View
      pointerEvents="box-none"
      className={cn(
        "w-full",
        showDesktopNav ? "items-center px-2 sm:px-4" : "px-0",
      )}
    >
      <View
        pointerEvents="auto"
        className={cn(
          "w-full flex-row items-center justify-between gap-1 min-w-0 border",
          showDesktopNav
            ? "max-w-[1000px] rounded-full px-2 sm:px-3 lg:px-4"
            : "rounded-none px-4 border-x-0 border-t-0",
        )}
        style={{
          height: NAVBAR_HEIGHT,
          backgroundColor: barBackground,
          borderColor: NEURAL.border,
        }}
      >
        <Pressable
          onPress={() => scrollToSection("hero")}
          className="flex-row items-center gap-1 sm:gap-1.5 px-1 shrink min-w-0"
          style={{ flexShrink: 1 }}
        >
          <BrandLogoMark
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
            textClassName="text-xs sm:text-sm"
          />
          {showBrandName ? (
            <Text
              className="text-sm sm:text-base lg:text-lg font-bold shrink"
              style={{ color: NEURAL.cyan }}
              numberOfLines={1}
            >
              Mono
            </Text>
          ) : null}
        </Pressable>

        {showDesktopNav ? (
          <View className="flex-row items-center gap-0.5 lg:gap-1 shrink-0 min-w-0">
            {navItems.map((item) => (
              <Pressable
                key={item.sectionId}
                onPress={() => scrollToSection(item.sectionId)}
                className={`rounded-full ${compactNav ? "px-2.5 py-2" : "px-3 lg:px-4 py-2.5"}`}
              >
                <Text
                  className={`font-medium ${compactNav ? "text-xs" : "text-sm"}`}
                  style={{ color: NEURAL.textSecondary }}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Pressable
            className="w-9 h-9 items-center justify-center shrink-0"
            onPress={() => setMobileMenuOpen((p) => !p)}
            accessibilityRole="button"
            accessibilityLabel={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X size={22} color={NEURAL.cyan} />
            ) : (
              <Menu size={22} color={NEURAL.cyan} />
            )}
          </Pressable>
        )}
      </View>

      {mobileMenuOpen && !showDesktopNav ? (
        <Animated.View
          pointerEvents="auto"
          className="w-full border-b"
          style={{
            opacity: menuAnimation,
            backgroundColor: NEURAL.elevated,
            borderColor: NEURAL.border,
            transform: [
              {
                translateY: menuAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-8, 0],
                }),
              },
            ],
          }}
        >
          <View className="w-full px-4 py-3">
            {navItems.map((item) => (
              <Pressable
                key={item.sectionId}
                className="px-4 py-3.5 rounded-xl mb-2 last:mb-0"
                style={{ backgroundColor: NEURAL.tile }}
                onPress={() => {
                  scrollToSection(item.sectionId);
                  setMobileMenuOpen(false);
                }}
              >
                <Text className="text-base" style={{ color: NEURAL.text }}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
