"use client";

import { Check, Download, ExternalLink } from "lucide-react-native";
import { Linking } from "react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Button } from "ui/components/button";
import { PREMIUM_PRODUCT_PAGE_URL } from "shared_mono_app/constants/product";
import { downloadFreeSource } from "shared_mono_app/utils/downloadFreeSource";

import { HoverBorderSurface } from "./HoverBorderSurface";
import { NEURAL } from "ui/theme/neuralRuntime";
import { AnimatedSection } from "./animatedSection";
import { SectionHeading } from "./sectionHeading";
import {
  isWeb,
  landingCardGrid,
  landingCardGridItem,
  landingCardShell,
  landingCardSurface,
} from "./platformStyles";

const FREE_VERSION_FEATURES = [
  "Turborepo monorepo (Next.js web + Expo mobile)",
  "Landing page focused on monorepo structure",
  "Shared packages: `ui`, `state`, `api`, `shared_mono_app`",
  "Neural dark theme (fixed)",
  "English-only UI copy",
  "Full source code — no login or dashboard screens",
] as const;

const PREMIUM_VERSION_FEATURES = [
  "Everything in the free monorepo starter",
  "Full web dashboard and mobile app screens",
  "OTP, PIN, and biometric authentication",
  "Dark / light mode toggle",
  "Multi-language support (EN / AR / FR)",
  "Complete reusable UI components and form builder",
  "AI Studio, workspace modules, and documentation",
  "Live demo, pricing, and checkout on the product page",
] as const;

function openProductPage() {
  void Linking.openURL(PREMIUM_PRODUCT_PAGE_URL);
}

function FeatureList({
  items,
  accent,
}: {
  items: readonly string[];
  accent: string;
}) {
  return (
    <View className="gap-2.5">
      {items.map((feature) => (
        <View key={feature} className="flex-row items-start gap-2.5">
          <View
            className="w-5 h-5 rounded-full items-center justify-center mt-0.5 shrink-0"
            style={{ backgroundColor: `${accent}22` }}
          >
            <Check size={12} color={accent} />
          </View>
          <Text
            className="text-sm leading-6 flex-1"
            style={{ color: NEURAL.textSecondary }}
          >
            {feature}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function VersionCompareSection() {
  return (
    <AnimatedSection nativeID="versions" className="w-full px-4 py-6">
      <View className="w-full max-w-[1100px] mx-auto">
        <SectionHeading
          variant="dark"
          badge="Free vs Premium"
          title="This ThemeWagon build vs the full product"
          subtitle="You are viewing the free monorepo starter. The premium version adds the complete dashboard, auth flows, and extended UI kit."
        />

        <View className={landingCardGrid}>
          <View className={landingCardGridItem("w-full lg:w-1/2")}>
            <AnimatedSection
              delay={80}
              variant="scale"
              className={landingCardShell}
            >
              <HoverBorderSurface
                className={`rounded-3xl p-6 md:p-7 ${landingCardSurface}`}
                accent={NEURAL.cyan}
              >
                <Text
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: NEURAL.cyan }}
                >
                  Included here
                </Text>
                <Text
                  className="text-xl font-bold mb-1"
                  style={{ color: NEURAL.text }}
                >
                  ThemeWagon Free
                </Text>
                <Text
                  className="text-2xl font-bold mb-3"
                  style={{ color: NEURAL.cyan }}
                >
                  Free
                </Text>
                <Text
                  className="text-sm leading-6 mb-5"
                  style={{ color: NEURAL.textSecondary }}
                >
                  Monorepo architecture shell published for ThemeWagon — landing
                  page and shared packages only.
                </Text>
                <FeatureList
                  items={FREE_VERSION_FEATURES}
                  accent={NEURAL.cyan}
                />
              </HoverBorderSurface>
            </AnimatedSection>
          </View>

          <View className={landingCardGridItem("w-full lg:w-1/2")}>
            <AnimatedSection
              delay={140}
              variant="scale"
              className={landingCardShell}
            >
              <HoverBorderSurface
                className={`rounded-3xl p-6 md:p-7 ${landingCardSurface}`}
                accent={NEURAL.violet}
                baseBorder={NEURAL.borderGlow}
              >
                <Text
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: NEURAL.violet }}
                >
                  Full product
                </Text>
                <Text
                  className="text-xl font-bold mb-1"
                  style={{ color: NEURAL.text }}
                >
                  Neural Workspace Premium
                </Text>
                <Text
                  className="text-sm leading-6 mb-5"
                  style={{ color: NEURAL.textSecondary }}
                >
                  Complete admin dashboard template with authentication,
                  workspace screens, and the full cross-platform UI library.
                </Text>
                <FeatureList
                  items={PREMIUM_VERSION_FEATURES}
                  accent={NEURAL.violet}
                />
              </HoverBorderSurface>
            </AnimatedSection>
          </View>
        </View>

        <AnimatedSection
          delay={200}
          variant="fadeUp"
          className="mt-8 items-center"
        >
          {/* <View className="flex-col sm:flex-row gap-3 w-full max-w-2xl items-stretch sm:items-center justify-center px-4"> */}
          {/* 
            <Button
              variant="outline"
              size="lg"
              className={`sm:flex-1 ${isWeb ? "transition-transform duration-300 hover:scale-[1.02]" : ""}`}
              textClassName="font-semibold text-base"
              label="Download Free Version"
              onPress={downloadFreeSource}
              icon={<Download size={18} color={NEURAL.cyan} />}
            /> */}
          <Button
            variant="primary"
            size="lg"
            // className={`sm:flex-1 ${isWeb ? "transition-transform duration-300 hover:scale-[1.02]" : ""}`}
            className={`max-w-md ${isWeb ? "transition-transform duration-300 hover:scale-[1.02]" : ""}`}
            textClassName="font-semibold text-base"
            label="Get the Full Version"
            onPress={openProductPage}
            icon={<ExternalLink size={18} color="#fff" />}
          />
          {/* </View> */}
          <Text
            className="text-xs text-center mt-4 leading-5 max-w-[560px] px-4"
            style={{ color: NEURAL.textDim }}
          >
            Opens the official premium product page with live demo, pricing, and
            purchase options.
          </Text>
        </AnimatedSection>
      </View>
    </AnimatedSection>
  );
}
