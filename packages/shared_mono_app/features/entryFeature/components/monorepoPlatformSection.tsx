"use client";

import { useState } from "react";
import {
  Check,
  Download,
  Globe,
  LayoutDashboard,
  Layers,
  Smartphone,
  X,
  ZoomIn,
} from "lucide-react-native";
import { Modal, Platform, Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView } from "ui/components/safeArea";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Image } from "ui/components/image";
import { Button } from "ui/components/button";
import { downloadDemoApk } from "shared_mono_app/utils/downloadDemoApk";
import { HoverBorderSurface } from "./HoverBorderSurface";
import { NEURAL, neuralAlpha } from "ui/theme/neuralRuntime";

import { AnimatedSection } from "./animatedSection";
import { SectionHeading } from "./sectionHeading";
import { isWeb } from "./platformStyles";
import PlatformScreenshot from "ui/assets/icons/DemoImg/Screenshot 2026-05-29 at 1.13.32 PM.png";

const USE_CASE_ICONS = [Globe, LayoutDashboard, Smartphone, Layers] as const;

const PLATFORM_USE_CASES = [
  "`yarn web` — Next.js app",
  "`apps/mobile` — Expo app",
  "Both apps, one install",
  "Add apps or packages anytime",
] as const;

const PLATFORM_FEATURES = [
  "`ui` — components and theme tokens",
  "`state` — sidebar and toast UI state",
  "`api` — fetch helpers and React Query setup",
  "`shared_mono_app` — feature modules used by apps",
] as const;

const PLATFORM_IMAGE_CAPTION =
  "Both apps consume the same shared packages from one repository.";
const PLATFORM_IMAGE_EXPAND_HINT = "Expand preview";

function PlatformScreenshotPreview({
  isOpen,
  onClose,
  caption,
}: {
  isOpen: boolean;
  onClose: () => void;
  caption: string;
}) {
  const { width, height } = useWindowDimensions();
  const framePadding = 24;
  const maxImageWidth = Math.max(width - framePadding * 2, 280);
  const maxImageHeight = Math.max(height - 120, 320);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: "rgba(2,6,12,0.96)" }}>
        <SafeAreaView
          edges={["top", "bottom", "left", "right"]}
          className="flex-1"
        >
          <View className="flex-1">
            <View className="flex-row items-center justify-between px-4 pt-2 pb-3">
              <Text
                className="text-sm flex-1 pr-3"
                style={{ color: NEURAL.textSecondary }}
                numberOfLines={2}
              >
                {caption}
              </Text>
              <Pressable
                onPress={onClose}
                className="w-10 h-10 rounded-full items-center justify-center border"
                style={{
                  borderColor: NEURAL.border,
                  backgroundColor: NEURAL.elevated,
                }}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <X size={20} color={NEURAL.text} />
              </Pressable>
            </View>
            <View className="flex-1 items-center justify-center px-4 pb-6">
              <Image
                src={PlatformScreenshot}
                resizeMode="contain"
                className="rounded-2xl"
                style={{
                  width: maxImageWidth,
                  height: maxImageHeight,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export function MonorepoPlatformSection() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { width } = useWindowDimensions();
  const showPlatformImage = width >= 600;
  const useThreeUseCaseCols = width >= 640;
  const stackUseCases = !isWeb || width < 640;

  return (
    <>
      <AnimatedSection nativeID="platform" className="w-full px-4 py-6">
        <View className="w-full max-w-[1100px] mx-auto">
          <SectionHeading
            badge="Workspace"
            title="Folder layout at a glance"
            subtitle="Applications stay in `apps/`. Reusable code lives in `packages/`. Turborepo connects builds and dev scripts across both."
          />
          <View
            className={
              isWeb
                ? "flex-col lg:flex-row gap-8 lg:gap-10 items-start"
                : "gap-6 w-full"
            }
          >
            <View className={isWeb ? "flex-1 min-w-0 gap-6" : "w-full gap-6"}>
              <AnimatedSection delay={80} variant="fadeUp">
                <View>
                  <Text
                    className="text-sm font-semibold uppercase tracking-widest mb-3"
                    style={{ color: NEURAL.cyan }}
                  >
                    Run what you need
                  </Text>
                  <View
                    className={
                      stackUseCases
                        ? "gap-3 w-full"
                        : "flex-row flex-wrap gap-3 items-stretch w-full"
                    }
                  >
                    {PLATFORM_USE_CASES.map((label, index) => {
                      const Icon = USE_CASE_ICONS[index] ?? Layers;
                      const isFullWidth =
                        !stackUseCases &&
                        index === PLATFORM_USE_CASES.length - 1;
                      const itemWidth = stackUseCases
                        ? undefined
                        : isFullWidth
                          ? "100%"
                          : useThreeUseCaseCols
                            ? "31.5%"
                            : "48%";
                      return (
                        <View
                          key={label}
                          className={stackUseCases ? "w-full" : undefined}
                          style={itemWidth ? { width: itemWidth } : undefined}
                        >
                          <HoverBorderSurface
                            accent={NEURAL.violet}
                            className={`rounded-2xl px-4 py-3 w-full flex-col justify-center ${
                              isWeb && !stackUseCases
                                ? "h-full min-h-[52px]"
                                : ""
                            }`}
                          >
                            <View className="flex-row items-center gap-2.5">
                              <View
                                className="w-9 h-9 rounded-xl items-center justify-center shrink-0"
                                style={{ backgroundColor: NEURAL.cyanSoft }}
                              >
                                <Icon size={18} color={NEURAL.cyan} />
                              </View>
                              <Text
                                className="text-sm font-medium flex-1"
                                style={{ color: NEURAL.text }}
                              >
                                {label}
                              </Text>
                            </View>
                          </HoverBorderSurface>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </AnimatedSection>

              <AnimatedSection delay={160} variant="fadeUp">
                <HoverBorderSurface
                  className="rounded-[24px] p-5 md:p-6"
                  accent={NEURAL.cyan}
                >
                  <View>
                    <Text
                      className="text-sm font-semibold uppercase tracking-widest mb-4"
                      style={{ color: NEURAL.violet }}
                    >
                      Shared packages
                    </Text>
                    <View className="gap-3">
                      {PLATFORM_FEATURES.map((feature) => (
                        <View
                          key={feature}
                          className="flex-row items-start gap-3"
                        >
                          <View
                            className="w-6 h-6 rounded-full items-center justify-center mt-0.5 shrink-0"
                            style={{ backgroundColor: NEURAL.cyanSoft }}
                          >
                            <Check size={14} color={NEURAL.cyan} />
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
                  </View>
                </HoverBorderSurface>
              </AnimatedSection>

              <AnimatedSection delay={200} variant="fadeUp">
                <View className="gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className={`w-full sm:w-auto px-8 h-[48px] ${isWeb ? "transition-transform duration-300 hover:scale-[1.03]" : ""}`}
                    textClassName="font-semibold text-base"
                    label="Download Android APK"
                    onPress={downloadDemoApk}
                    icon={<Download size={18} color="#fff" />}
                  />
                  <Text
                    className="text-xs leading-5"
                    style={{ color: NEURAL.textDim }}
                  >
                    Install the free monorepo starter demo on your Android
                    device.
                  </Text>
                </View>
              </AnimatedSection>
            </View>

            {Platform.OS === "web" ? (
              <>
                {showPlatformImage ? (
                  <AnimatedSection
                    delay={120}
                    variant="scale"
                    className="w-full lg:w-[46%] lg:max-w-[520px] shrink-0 self-start"
                  >
                    <HoverBorderSurface
                      accent={NEURAL.violet}
                      className="rounded-[24px] p-3 md:p-4 overflow-hidden"
                    >
                      <View>
                        <Pressable
                          onPress={() => setPreviewOpen(true)}
                          accessibilityRole="button"
                          accessibilityLabel={PLATFORM_IMAGE_EXPAND_HINT}
                          className="relative w-full"
                        >
                          <View className="relative w-full">
                            <Image
                              src={PlatformScreenshot}
                              resizeMode="cover"
                              className="w-full rounded-2xl"
                              style={{ aspectRatio: 16 / 10, minHeight: 320 }}
                            />
                            <View
                              className="absolute bottom-3 right-3 flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-full border"
                              style={{
                                backgroundColor: neuralAlpha(
                                  NEURAL.canvas,
                                  0.87,
                                ),
                                borderColor: NEURAL.borderGlow,
                              }}
                            >
                              <View className="flex-row items-center gap-1.5">
                                <ZoomIn size={14} color={NEURAL.cyan} />
                                <Text
                                  className="text-[11px] font-medium"
                                  style={{ color: NEURAL.cyan }}
                                >
                                  {PLATFORM_IMAGE_EXPAND_HINT}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </Pressable>
                        <Text
                          className="text-xs mt-3 px-1 text-center leading-5"
                          style={{ color: NEURAL.textDim }}
                        >
                          {PLATFORM_IMAGE_CAPTION}
                        </Text>
                      </View>
                    </HoverBorderSurface>
                  </AnimatedSection>
                ) : null}
              </>
            ) : null}
          </View>
        </View>
      </AnimatedSection>

      {showPlatformImage ? (
        <PlatformScreenshotPreview
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          caption={PLATFORM_IMAGE_CAPTION}
        />
      ) : null}
    </>
  );
}
