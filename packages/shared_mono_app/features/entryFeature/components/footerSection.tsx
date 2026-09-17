"use client";

import { Linking, Pressable } from "react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";

import {
  AUTHOR_LINKEDIN_URL,
  AUTHOR_NAME,
  SUPPORT_EMAIL,
  THEMEWAGON_URL,
} from "shared_mono_app/constants/product";
import { NEURAL } from "ui/theme/neuralRuntime";
import { AnimatedSection } from "./animatedSection";
import { scrollToSection } from "../utils/scrollToSection";

function openExternalUrl(url: string) {
  void Linking.openURL(url);
}

export function FooterSection() {
  return (
    <AnimatedSection
      className="w-full px-6 py-10 border-t"
      style={{ borderColor: NEURAL.border }}
    >
      <View className="w-full max-w-[800px] mx-auto items-center">
        <Pressable
          className="w-full items-center"
          onPress={() => scrollToSection("showcase")}
        >
          <Text
            className="text-3xl md:text-4xl font-bold text-center"
            style={{ color: NEURAL.text }}
          >
            Build from one workspace
          </Text>
          <Text
            className="text-center mt-3 text-sm"
            style={{ color: NEURAL.textSecondary }}
          >
            Clone the repo, run the apps, and extend the packages as your
            product grows.
          </Text>
          <Text
            className="text-center mt-4 text-base leading-7 max-w-[560px]"
            style={{ color: NEURAL.textSecondary }}
          >
            Start from a clear `apps/` + `packages/` structure instead of wiring
            cross-platform tooling yourself.
          </Text>
        </Pressable>

        <View className="mt-12 items-center gap-2 px-2">
          <Text
            className="text-xs text-center"
            style={{ color: NEURAL.textDim }}
          >
            © {new Date().getFullYear()} Monorepo Starter. All rights reserved.
          </Text>
          <Text
            className="text-xs text-center leading-5"
            style={{ color: NEURAL.textDim }}
          >
            Designed by{" "}
            <Text
              accessibilityRole="link"
              onPress={() => openExternalUrl(AUTHOR_LINKEDIN_URL)}
              style={{ color: NEURAL.cyan }}
            >
              {AUTHOR_NAME}
            </Text>
          </Text>
          <Text
            className="text-xs text-center"
            style={{ color: NEURAL.textDim }}
          >
            Contact: {SUPPORT_EMAIL}
          </Text>
          <Text
            className="text-xs text-center leading-5"
            style={{ color: NEURAL.textDim }}
          >
            Distributed by{" "}
            <Text
              accessibilityRole="link"
              onPress={() => openExternalUrl(THEMEWAGON_URL)}
              style={{ color: NEURAL.cyan }}
            >
              ThemeWagon
            </Text>
          </Text>
        </View>
      </View>
    </AnimatedSection>
  );
}
