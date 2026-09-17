import { ArrowRight, FolderTree, Layers, Package } from "lucide-react-native";
import { Pressable } from "react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { HoverBorderSurface } from "./HoverBorderSurface";
import { NEURAL } from "ui/theme/neuralRuntime";
import { AnimatedSection } from "./animatedSection";
import { SectionHeading } from "./sectionHeading";
import { scrollToSection } from "../utils/scrollToSection";

const SHOWCASES = [
  {
    key: "showcase1",
    badge: "apps/",
    title: "Thin application shells",
    description:
      "Routing, providers, and platform entry points only. Business logic imports from `packages/`.",
    cta: "See packages",
    icon: FolderTree,
    accentKey: "cyan" as const,
    target: "platform" as const,
  },
  {
    key: "showcase2",
    badge: "packages/",
    title: "Shared implementation",
    description:
      "UI, state, API clients, and features are versioned together and imported by every app.",
    cta: "See workflow",
    icon: Package,
    accentKey: "violet" as const,
    target: "features" as const,
  },
  {
    key: "showcase3",
    badge: "root",
    title: "Turborepo orchestration",
    description:
      "One `package.json` at the root runs dev, build, and lint for the whole workspace.",
    cta: "Read FAQ",
    icon: Layers,
    accentKey: "positive" as const,
    target: "faq" as const,
  },
] as const;

export function CapabilitiesShowcaseSection() {
  const accents = {
    cyan: NEURAL.cyan,
    violet: NEURAL.violet,
    positive: NEURAL.positive,
  };

  return (
    <AnimatedSection nativeID="showcase" className="w-full px-6 py-6">
      <View className="w-full max-w-[1100px] mx-auto">
        <SectionHeading
          variant="dark"
          badge="Structure"
          title="Three folders to understand"
          subtitle="If you know where code belongs, the rest of the repo stays maintainable."
        />

        <View className="gap-6">
          {SHOWCASES.map((item, index) => {
            const Icon = item.icon;
            const accent = accents[item.accentKey];
            return (
              <AnimatedSection
                key={item.key}
                delay={100 + index * 80}
                variant="fadeUp"
              >
                <HoverBorderSurface
                  accent={accent}
                  className="rounded-[24px] p-6 md:p-8 flex-row flex-wrap items-center gap-6"
                >
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: `${accent}18` }}
                  >
                    <Icon size={26} color={accent} />
                  </View>
                  <View className="flex-1 min-w-[240px]">
                    <Text
                      className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                      style={{ color: accent }}
                    >
                      {item.badge}
                    </Text>
                    <Text
                      className="text-xl md:text-2xl font-bold mb-2"
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
                  </View>
                  <Pressable
                    onPress={() => scrollToSection(item.target)}
                    className="flex-row items-center gap-2 px-5 py-2.5 rounded-full"
                    style={{ backgroundColor: NEURAL.cyanSoft }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: NEURAL.cyan }}
                    >
                      {item.cta}
                    </Text>
                    <ArrowRight size={16} color={NEURAL.cyan} />
                  </Pressable>
                </HoverBorderSurface>
              </AnimatedSection>
            );
          })}
        </View>
      </View>
    </AnimatedSection>
  );
}
