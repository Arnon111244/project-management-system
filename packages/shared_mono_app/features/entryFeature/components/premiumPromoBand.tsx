"use client";

import { ArrowRight, Sparkles } from "lucide-react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Button } from "ui/components/button";
import { HoverBorderSurface } from "./HoverBorderSurface";
import { NEURAL, neuralAlpha } from "ui/theme/neuralRuntime";
import { AnimatedSection } from "./animatedSection";
import { scrollToSection } from "../utils/scrollToSection";
import { isWeb } from "./platformStyles";

const PERKS = ["Full dashboard", "Auth flows", "Multi-language"] as const;

export function PremiumPromoBand() {
  return (
    <AnimatedSection className="w-full px-4 py-4">
      <View className="w-full max-w-[1100px] mx-auto">
        <HoverBorderSurface
          accent={NEURAL.violet}
          baseBorder={NEURAL.borderGlow}
          className="rounded-[28px] p-6 md:p-8 overflow-hidden"
          style={{ backgroundColor: neuralAlpha(NEURAL.violet, 0.08) }}
        >
          <View
            className={
              isWeb ? "flex-row flex-wrap items-center gap-6" : "gap-6"
            }
          >
            <View className="flex-1 min-w-[260px] gap-3">
              <View className="flex-row items-center gap-2">
                <Sparkles size={18} color={NEURAL.violet} />
                <Text
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: NEURAL.violet }}
                >
                  Full product available
                </Text>
              </View>
              <Text
                className="text-2xl md:text-3xl font-bold leading-tight"
                style={{ color: NEURAL.text }}
              >
                Need dashboards, auth, and the complete UI kit?
              </Text>
              <Text
                className="text-sm leading-6 max-w-[520px]"
                style={{ color: NEURAL.textSecondary }}
              >
                This free build shows the monorepo architecture. The premium
                version adds production screens, OTP login, dark/light mode, and
                the full cross-platform component library.
              </Text>
              <View className="flex-row flex-wrap gap-2 mt-1">
                {PERKS.map((perk) => (
                  <View
                    key={perk}
                    className="rounded-full px-3 py-1 border"
                    style={{
                      borderColor: NEURAL.borderGlow,
                      backgroundColor: NEURAL.elevated,
                    }}
                  >
                    <Text
                      className="text-[11px] font-medium"
                      style={{ color: NEURAL.cyan }}
                    >
                      {perk}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View
              className={`gap-3 ${isWeb ? "shrink-0 min-w-[220px]" : "w-full"}`}
            >
              <Button
                variant="primary"
                size="lg"
                className={`w-full ${isWeb ? "hover:scale-[1.02]" : ""}`}
                textClassName="font-semibold"
                label="Compare free vs premium"
                onPress={() => scrollToSection("versions")}
              />
            </View>
          </View>
        </HoverBorderSurface>
      </View>
    </AnimatedSection>
  );
}
