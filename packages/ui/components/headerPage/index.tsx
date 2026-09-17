import React, { useCallback } from "react";
import { Pressable } from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { ArrowLeft } from "lucide-react-native";
import { navigate } from "shared_mono_app/utils/router";
import { colors } from "ui/theme";
import { useTheme } from "ui/theme/themeProvider";
interface WithdrawHeaderProps {
  title?: string;
  onBackPress?: () => void;
}

const HeaderBankTransferComponent: React.FC<WithdrawHeaderProps> = ({
  onBackPress,
}) => {
  const ctx = useTheme();
  if (!ctx) return null;
  const { effective: mode } = ctx;
  const iconColor = mode === "dark" ? colors.white : colors.black;
  const backButtonClass =
    "absolute left-0 border border-silver dark:border-[#EEEDEE3D] rounded-full p-2 hover:bg-[#EEEDEE3D]";

  const handleBackPress = useCallback(() => {
    if (onBackPress) onBackPress();
    else navigate("/api");
  }, [onBackPress]);

  return (
    <View className="relative w-full flex-row items-center justify-center mb-4 ">
      <Pressable
        onPress={handleBackPress}
        className={`${backButtonClass} items-center justify-center`}
        style={{ width: 36, height: 36, alignSelf: "center" }}
      >
        <ArrowLeft color={iconColor} width={24} height={24} />
      </Pressable>
      <Text className="text-[16px] font-bold text-dark dark:text-white">
        Wallet
      </Text>
    </View>
  );
};

export const HeaderBankTransfer = React.memo(HeaderBankTransferComponent);
HeaderBankTransfer.displayName = "HeaderBankTransfer";
