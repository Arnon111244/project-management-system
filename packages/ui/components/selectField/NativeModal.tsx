import { Modal, Pressable, Platform, View } from "react-native";
import type { SelectOption } from "./types";
import { IOSPicker } from "./components/IOSPicker";
import { AndroidList } from "./components/AndroidList";

interface NativeModalProps {
  open: boolean;
  onClose: () => void;
  onDone: (value: string) => void;
  options: SelectOption[];
  tempValue: string;
  onTempChange?: (val: string) => void;
  isRTL: boolean;
  rippleConfig: any;
  theme: "light" | "dark";
  placeholder?: string;
  selectedOption: SelectOption | null;
  firstValue: string;
}

export function NativeModal({
  open,
  onClose,
  onDone,
  options,
  tempValue,
  onTempChange,
  isRTL,
  rippleConfig,
  theme,
  placeholder,
  selectedOption,
  firstValue,
}: NativeModalProps) {
  if (Platform.OS === "web") return null;

  const handleOptionSelect = (value: string) => {
    onTempChange?.(value);
    onDone(value);
  };

  return (
    <Modal
      transparent
      visible={open}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <Pressable
        className="flex-1"
        onPress={onClose}
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <View
          className="flex-1 justify-end"
          style={{ pointerEvents: "box-none" }}
        >
          <Pressable
            className="mt-auto rounded-t-2xl p-3 bg-surface dark:bg-black border-t border-border dark:border-border-dark"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center mb-3">
              <View
                style={{
                  width: 80,
                  height: 6,
                  backgroundColor: "#9E9E9E",
                  borderRadius: 3,
                }}
              />
            </View>

            {Platform.OS === "ios" ? (
              <IOSPicker
                options={options}
                tempValue={tempValue}
                onTempChange={handleOptionSelect}
                isRTL={isRTL}
                theme={theme}
                placeholder={placeholder}
                selectedOption={selectedOption}
                firstValue={firstValue}
              />
            ) : (
              <AndroidList
                options={options}
                tempValue={tempValue}
                onTempChange={handleOptionSelect}
                isRTL={isRTL}
                rippleConfig={rippleConfig}
                theme={theme}
              />
            )}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
