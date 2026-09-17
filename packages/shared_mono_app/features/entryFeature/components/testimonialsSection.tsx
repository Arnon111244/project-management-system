import { Quote } from "lucide-react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { HoverBorderSurface } from "./HoverBorderSurface";
import { NEURAL } from "ui/theme/neuralRuntime";
import { AnimatedSection } from "./animatedSection";
import { SectionHeading } from "./sectionHeading";
import { landingCardGrid, landingCardGridItem } from "./platformStyles";

const TESTIMONIALS = [
  {
    quote:
      "I stopped maintaining two repos for the same UI. Shared components between Next.js and Expo actually work here.",
    name: "Maya Chen",
    role: "Full-stack developer",
    accent: NEURAL.cyan,
  },
  {
    quote:
      "The package boundaries are obvious from day one. New engineers know exactly where web routing ends and shared logic begins.",
    name: "James Okoro",
    role: "Engineering lead",
    accent: NEURAL.violet,
  },
  {
    quote:
      "Turborepo caching alone saved our team hours every week. Build only what changed — that's the selling point for me.",
    name: "Sofia Martinez",
    role: "Startup founder",
    accent: NEURAL.positive,
  },
] as const;

export function TestimonialsSection() {
  return (
    <AnimatedSection nativeID="testimonials" className="w-full px-4 py-6">
      <View className="w-full max-w-[1100px] mx-auto">
        <SectionHeading
          badge="Developer feedback"
          title="What builders say about monorepos done right"
          subtitle="Real workflow wins — the kind of social proof that helps ThemeWagon visitors understand the value fast."
        />

        <View className={landingCardGrid}>
          {TESTIMONIALS.map((item, index) => (
            <View
              key={item.name}
              className={landingCardGridItem("w-full md:w-1/3")}
            >
              <AnimatedSection delay={90 + index * 70} variant="fadeUp">
                <HoverBorderSurface
                  accent={item.accent}
                  className="rounded-3xl p-6 min-h-[220px] flex-col"
                >
                  <Quote size={22} color={item.accent} />
                  <Text
                    className="text-sm leading-6 mt-4 flex-1"
                    style={{ color: NEURAL.textSecondary }}
                  >
                    "{item.quote}"
                  </Text>
                  <View
                    className="mt-5 pt-4 border-t"
                    style={{ borderColor: NEURAL.border }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{ color: NEURAL.text }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-xs mt-0.5"
                      style={{ color: NEURAL.textDim }}
                    >
                      {item.role}
                    </Text>
                  </View>
                </HoverBorderSurface>
              </AnimatedSection>
            </View>
          ))}
        </View>
      </View>
    </AnimatedSection>
  );
}
