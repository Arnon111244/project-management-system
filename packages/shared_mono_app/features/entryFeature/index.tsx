"use client";

import { useEffect, useRef } from "react";
import { ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View } from "ui/components/view";

import {
  bindLandingScrollView,
  setLandingScrollY,
} from "./utils/landingScrollRegistry";

import { Navbar } from "./components/navbar";
import { PromoStrip } from "./components/promoStrip";
import { useLandingHeaderOffset } from "./hooks/useLandingHeaderOffset";
import { HeroSection } from "./components/heroSection";
import { CapabilitiesShowcaseSection } from "./components/capabilitiesShowcaseSection";
import { QuickStartSection } from "./components/quickStartSection";
import { BenefitsSection } from "./components/benefitsSection";
import { MonorepoPlatformSection } from "./components/monorepoPlatformSection";
import { FeaturesSection } from "./components/featuresSection";
import { PremiumPromoBand } from "./components/premiumPromoBand";
import { VersionCompareSection } from "./components/versionCompareSection";
import { TestimonialsSection } from "./components/testimonialsSection";
import { FaqSection } from "./components/faqSection";
import { FooterSection } from "./components/footerSection";
import { NeuralAnimatedBackground } from "./components/NeuralAnimatedBackground";
import { useTheme } from "ui/theme/themeProvider";

export function EntryFeature() {
  useTheme();
  const headerOffset = useLandingHeaderOffset();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    bindLandingScrollView(scrollRef.current, headerOffset);
  }, [headerOffset]);

  const bindScrollRef = (node: ScrollView | null) => {
    scrollRef.current = node;
    bindLandingScrollView(node, headerOffset);
  };

  return (
    <View className="flex-1 relative overflow-hidden">
      <NeuralAnimatedBackground />

      <View className="flex-1 relative z-10">
        <View
          pointerEvents="box-none"
          className={
            Platform.OS === "web"
              ? "fixed top-0 left-0 right-0 z-[9999]"
              : "absolute top-0 left-0 right-0 z-[9999]"
          }
          style={Platform.OS !== "web" ? { paddingTop: insets.top } : undefined}
        >
          <PromoStrip />
          <Navbar />
        </View>

        <ScrollView
          ref={bindScrollRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          onScroll={(event) => {
            setLandingScrollY(event.nativeEvent.contentOffset.y);
          }}
          contentContainerStyle={{
            paddingTop: headerOffset,
            paddingBottom: 32,
          }}
        >
          <HeroSection />
          <QuickStartSection />
          <PremiumPromoBand />
          <CapabilitiesShowcaseSection />
          <BenefitsSection />
          <MonorepoPlatformSection />
          <FeaturesSection />
          <VersionCompareSection />
          <TestimonialsSection />
          <FaqSection />
          <FooterSection />
          <View className="h-12" />
        </ScrollView>
      </View>
    </View>
  );
}
