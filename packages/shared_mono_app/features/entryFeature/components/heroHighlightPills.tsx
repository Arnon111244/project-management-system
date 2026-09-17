import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { NEURAL, neuralAlpha } from "ui/theme/neuralRuntime";
import { isWeb } from "./platformStyles";

const HIGHLIGHTS = [
  { label: "Free on ThemeWagon", accent: NEURAL.cyan },
  { label: "Full source code", accent: NEURAL.violet },
  { label: "Android APK", accent: NEURAL.positive },
  { label: "Premium upgrade", accent: NEURAL.violet },
] as const;

const TRENDING = [
  "Turborepo",
  "Next.js 15",
  "Expo 54",
  "TypeScript",
  "Yarn workspaces",
  "Shared UI",
] as const;

export function HeroHighlightPills() {
  return (
    <View className="w-full mt-6 gap-4">
      <View
        className={`flex-row flex-wrap justify-center gap-2 ${isWeb ? "gap-2.5" : "gap-2"}`}
      >
        {HIGHLIGHTS.map((item) => (
          <View
            key={item.label}
            className="rounded-full px-3 py-1.5 border"
            style={{
              backgroundColor: neuralAlpha(item.accent, 0.12),
              borderColor: neuralAlpha(item.accent, 0.35),
            }}
          >
            <Text
              className="text-[11px] sm:text-xs font-semibold"
              style={{ color: item.accent }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      <View className="items-center gap-2">
        <Text
          className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: NEURAL.textDim }}
        >
          Built with
        </Text>
        <View className="flex-row flex-wrap justify-center gap-2 px-1">
          {TRENDING.map((tag) => (
            <View
              key={tag}
              className="rounded-lg px-2.5 py-1"
              style={{
                backgroundColor: NEURAL.elevated,
                borderWidth: 1,
                borderColor: NEURAL.border,
              }}
            >
              <Text
                className="text-[11px] font-medium"
                style={{ color: NEURAL.textSecondary }}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
