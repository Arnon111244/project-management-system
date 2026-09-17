import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Pressable } from "react-native";
import { NEURAL } from "ui/theme/neuralRuntime";
import { AnimatedSection } from "./animatedSection";
import { NeuralPromptBar } from "./NeuralPromptBar";
import { TrustMarqueeSection } from "./trustMarqueeSection";
import { HeroStatsRow } from "./heroStatsRow";
import { HeroHighlightPills } from "./heroHighlightPills";
import { NeuralHeroBackground } from "./NeuralAnimatedBackground";
import { scrollToSection } from "../utils/scrollToSection";
import { useLandingSectionRef } from "../hooks/useLandingSectionRef";

export function HeroSection() {
  const heroRef = useLandingSectionRef("hero");

  return (
    <View
      ref={heroRef}
      nativeID="hero"
      collapsable={false}
      className="relative w-full overflow-hidden pb-6 md:pb-12"
    >
      <NeuralHeroBackground />

      <Pressable className="relative z-10 w-full max-w-[900px] mx-auto px-3 sm:px-4 md:px-6 items-center pt-4 sm:pt-6 md:pt-8">
        <AnimatedSection delay={0} variant="fadeUp">
          <View
            className="mb-4 sm:mb-6 self-center rounded-full px-3 sm:px-4 py-1.5 border max-w-full"
            style={{
              backgroundColor: NEURAL.cyanSoft,
              borderColor: NEURAL.borderGlow,
            }}
          >
            <Text
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-center"
              style={{ color: NEURAL.cyan }}
            >
              Turborepo · Next.js · Expo
            </Text>
          </View>
        </AnimatedSection>

        <AnimatedSection delay={80} variant="fadeUp">
          <Text
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] text-center px-1"
            style={{ color: NEURAL.text }}
          >
            One repo.{"\n"}
            <Text style={{ color: NEURAL.violet }}>Web and mobile.</Text>
          </Text>
        </AnimatedSection>

        <AnimatedSection delay={160} variant="fadeUp">
          <Text
            className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 text-center max-w-[600px] px-1"
            style={{ color: NEURAL.textSecondary }}
          >
            A production-ready monorepo layout — shared packages, two app
            targets, and Turborepo scripts from the root.
          </Text>
        </AnimatedSection>

        <AnimatedSection delay={220} variant="scale" className="w-full mt-8">
          <NeuralPromptBar
            size="lg"
            placeholder="Explore the workspace layout…"
            onGenerate={() => scrollToSection("showcase")}
          />
        </AnimatedSection>

        <AnimatedSection delay={280} variant="fadeUp" className="w-full">
          <HeroHighlightPills />
        </AnimatedSection>

        <AnimatedSection delay={320} variant="fadeUp" className="w-full">
          <HeroStatsRow />
        </AnimatedSection>

        <AnimatedSection
          delay={380}
          variant="fadeUp"
          className="w-full mt-8 md:mt-12"
        >
          <TrustMarqueeSection />
        </AnimatedSection>
      </Pressable>
    </View>
  );
}
