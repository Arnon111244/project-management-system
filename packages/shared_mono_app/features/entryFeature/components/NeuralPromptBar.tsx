import { useState } from "react";
import { TextInput, Platform, useWindowDimensions } from "react-native";
import { Sparkles } from "lucide-react-native";

import { View } from "ui/components/view";
import { Button } from "ui/components/button";
import { NEURAL } from "ui/theme/neuralRuntime";
import { isWeb } from "./platformStyles";

type NeuralPromptBarProps = {
  placeholder?: string;
  buttonLabel?: string;
  onGenerate: (text: string) => void;
  size?: "lg" | "md";
  className?: string;
};

export function NeuralPromptBar({
  placeholder = "Describe what you want to build…",
  buttonLabel = "View structure",
  onGenerate,
  size = "md",
  className,
}: NeuralPromptBarProps) {
  const [value, setValue] = useState("");
  const { width } = useWindowDimensions();
  const isWide = width >= 400;
  const isLg = size === "lg";

  const submit = () => {
    if (!value.trim()) return;
    onGenerate(value.trim());
    setValue("");
  };

  return (
    <View
      className={`w-full rounded-2xl border overflow-hidden ${className ?? ""}`}
      style={{
        borderColor: NEURAL.borderGlow,
        backgroundColor: NEURAL.elevated,
        shadowColor: NEURAL.cyan,
        shadowOpacity: 0.15,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
      }}
    >
      <View
        className={`gap-2 ${isLg ? "p-2" : "p-1.5"} ${isWide ? "ps-4" : ""}`}
        style={{
          flexDirection: isWide ? "row" : "column",
          alignItems: isWide ? "center" : "stretch",
        }}
      >
        <View className="flex-row items-center gap-2 min-w-0 flex-1">
          <Sparkles size={isLg ? 18 : 16} color={NEURAL.cyan} />
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={NEURAL.textDim}
            onSubmitEditing={submit}
            className={`flex-1 min-w-0 ${isLg ? (isWide ? "text-base py-4" : "text-sm py-3") : isWide ? "text-sm py-3" : "text-sm py-2.5"}`}
            style={{
              color: NEURAL.text,
              textAlign: "left",
              writingDirection: "ltr",
              ...(Platform.OS === "web"
                ? ({ outlineStyle: "none" } as object)
                : {}),
            }}
          />
        </View>
      </View>
    </View>
  );
}
