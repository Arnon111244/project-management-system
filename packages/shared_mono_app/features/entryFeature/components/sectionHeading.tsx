import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { NEURAL } from "ui/theme/neuralRuntime";
import { Pressable } from "react-native";
type SectionHeadingProps = {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  variant?: "light" | "dark";
};

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
}: SectionHeadingProps) {
  return (
    <Pressable className={`mb-12 ${centered ? "items-center" : ""}`}>
      {badge ? (
        <View
          className="mb-4 rounded-full px-4 py-1.5"
          style={{ backgroundColor: NEURAL.cyanSoft }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: NEURAL.cyan }}
          >
            {badge}
          </Text>
        </View>
      ) : null}

      <Text
        className={`text-3xl md:text-4xl font-bold max-w-[800px] ${centered ? "text-center" : ""}`}
        style={{ color: NEURAL.text }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          className={`mt-4 text-base md:text-lg max-w-[640px] leading-7 ${centered ? "text-center" : ""}`}
          style={{ color: NEURAL.textSecondary }}
        >
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}
