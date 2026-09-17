import { Code2, Repeat2, Timer } from "lucide-react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { HoverBorderSurface } from "./HoverBorderSurface";
import { NEURAL } from "ui/theme/neuralRuntime";
import { AnimatedSection } from "./animatedSection";
import { SectionHeading } from "./sectionHeading";
import { landingCardGrid, landingCardGridItem } from "./platformStyles";

const BENEFITS = [
  {
    title: "Write once, ship twice",
    description:
      "Shared UI, state, and API clients import into Next.js and Expo. Fix a bug once — both platforms get the update.",
    icon: Repeat2,
    accent: NEURAL.cyan,
  },
  {
    title: "Type-safe across packages",
    description:
      "TypeScript path aliases connect every package. Refactors stay consistent from `packages/ui` to `apps/mobile`.",
    icon: Code2,
    accent: NEURAL.violet,
  },
  {
    title: "Faster CI & local builds",
    description:
      "Turborepo caches task outputs. Re-run `turbo build` or `turbo lint` and only changed packages rebuild.",
    icon: Timer,
    accent: NEURAL.positive,
  },
] as const;

export function BenefitsSection() {
  return (
    <AnimatedSection nativeID="benefits" className="w-full px-4 py-6">
      <View className="w-full max-w-[1100px] mx-auto">
        <SectionHeading
          badge="Why monorepo"
          title="Built for teams who ship web and mobile together"
          subtitle="Ship web and mobile from one workspace — without duplicating components, configs, or installs."
        />

        <View className={landingCardGrid}>
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <View
                key={item.title}
                className={landingCardGridItem("w-full md:w-1/3")}
              >
                <AnimatedSection delay={100 + index * 80} variant="scale">
                  <HoverBorderSurface
                    accent={item.accent}
                    className="rounded-3xl p-6 md:p-7 flex-col items-start min-h-[220px]"
                  >
                    <View
                      className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
                      style={{ backgroundColor: `${item.accent}18` }}
                    >
                      <Icon size={22} color={item.accent} />
                    </View>
                    <Text
                      className="text-lg font-bold mb-2"
                      style={{ color: NEURAL.text }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      className="text-sm leading-6"
                      style={{ color: NEURAL.textSecondary }}
                    >
                      {item.description}
                    </Text>
                  </HoverBorderSurface>
                </AnimatedSection>
              </View>
            );
          })}
        </View>
      </View>
    </AnimatedSection>
  );
}
