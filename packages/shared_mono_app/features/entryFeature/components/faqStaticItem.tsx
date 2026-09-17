import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { NEURAL } from "ui/theme/neuralRuntime";

type FaqStaticItemProps = {
  question: string;
  answer: string;
};

export function FaqStaticItem({ question, answer }: FaqStaticItemProps) {
  return (
    <View
      className="rounded-2xl p-5"
      style={{
        backgroundColor: NEURAL.tile,
        borderColor: NEURAL.border,
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <Text className="text-sm font-semibold" style={{ color: NEURAL.text }}>
        {question}
      </Text>
      <Text
        className="text-sm leading-6 mt-3"
        style={{ color: NEURAL.textSecondary }}
      >
        {answer}
      </Text>
    </View>
  );
}
