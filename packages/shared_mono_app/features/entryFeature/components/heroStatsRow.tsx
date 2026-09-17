import { Smartphone, Package, Layers, Zap } from "lucide-react-native";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { AnimatedCounter } from "./animatedCounter";
import { HoverBorderSurface } from "./HoverBorderSurface";
import { NEURAL } from "ui/theme/neuralRuntime";
import { isWeb, landingCardGrid, landingCardGridItem } from "./platformStyles";

const STATS = [
  {
    value: "2",
    label: "App targets",
    sub: "Web + Mobile",
    icon: Smartphone,
    accent: NEURAL.cyan,
  },
  {
    value: "5",
    label: "Shared packages",
    sub: "ui · state · api",
    icon: Package,
    accent: NEURAL.violet,
  },
  {
    value: "1",
    label: "Root install",
    sub: "Yarn workspaces",
    icon: Layers,
    accent: NEURAL.positive,
  },
  {
    value: "3",
    label: "Min to run",
    suffix: " min",
    sub: "Clone to localhost",
    icon: Zap,
    accent: NEURAL.cyan,
  },
] as const;

export function HeroStatsRow() {
  return (
    <View className={`w-full mt-8 ${landingCardGrid}`}>
      {STATS.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <View
            key={stat.label}
            className={landingCardGridItem("w-1/2 md:w-1/4")}
          >
            <HoverBorderSurface
              accent={stat.accent}
              className="rounded-2xl px-4 py-4 items-center min-h-[108px] justify-center"
            >
              <View
                className="w-9 h-9 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: `${stat.accent}18` }}
              >
                <Icon size={18} color={stat.accent} />
              </View>
              <AnimatedCounter
                value={`${stat.value}${"suffix" in stat ? stat.suffix : "+"}`}
                delay={index * 80}
                className="text-2xl font-bold"
                style={{ color: NEURAL.text }}
              />
              <Text
                className="text-xs font-semibold mt-1 text-center"
                style={{ color: NEURAL.text }}
              >
                {stat.label}
              </Text>
              <Text
                className="text-[10px] mt-0.5 text-center"
                style={{ color: NEURAL.textDim }}
              >
                {stat.sub}
              </Text>
            </HoverBorderSurface>
          </View>
        );
      })}
    </View>
  );
}
