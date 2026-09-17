import {
  FolderTree,
  GitBranch,
  Layers,
  Package,
  Terminal,
  Workflow,
} from "lucide-react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";

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

const FEATURE_ICONS = [
  Workflow,
  GitBranch,
  Package,
  Layers,
  Terminal,
  FolderTree,
] as const;

const MONOREPO_FEATURES = [
  "Turborepo task pipeline and build cache",
  "Yarn workspaces dependency graph",
  "TypeScript path aliases across packages",
  "`apps/web` + `apps/mobile` in one clone",
  "Root scripts: `turbo dev`, `turbo build`, `turbo lint`",
  "Package boundaries that scale with your product",
] as const;

export function FeaturesSection() {
  const features = MONOREPO_FEATURES.map((title, index) => ({
    key: `${index}-${title}`,
    icon: FEATURE_ICONS[index] ?? Workflow,
    title,
  }));

  return (
    <AnimatedSection nativeID="features" className="w-full px-4 py-6">
      <View className="w-full max-w-[1200px] mx-auto">
        <SectionHeading
          variant="dark"
          badge="Why monorepo"
          title="Less duplication. Clear ownership."
          subtitle="Shared UI, state, and API code ship once and import everywhere — the main reason this template exists."
        />

        <View
          className={
            isWeb
              ? "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : landingCardGrid
          }
        >
          {features.map(({ key, icon: Icon, title }, index) => (
            <View
              key={key}
              className={
                isWeb
                  ? "w-full"
                  : landingCardGridItem("w-full md:w-1/2 lg:w-1/3")
              }
            >
              <AnimatedSection
                delay={150 + index * 70}
                variant="scale"
                className={landingCardShell}
              >
                <HoverBorderSurface
                  className={`rounded-3xl p-6 min-h-[152px] ${landingCardSurface} ${isWeb ? "transition-transform duration-300 hover:scale-[1.02]" : ""}`}
                >
                  <View
                    className="w-11 h-11 rounded-xl items-center justify-center mb-4 shrink-0"
                    style={{ backgroundColor: NEURAL.cyanSoft }}
                  >
                    <Icon size={20} color={NEURAL.cyan} />
                  </View>
                  <Text
                    className="text-base font-bold leading-6"
                    style={{ color: NEURAL.text }}
                  >
                    {title}
                  </Text>
                </HoverBorderSurface>
              </AnimatedSection>
            </View>
          ))}
        </View>
      </View>
    </AnimatedSection>
  );
}
