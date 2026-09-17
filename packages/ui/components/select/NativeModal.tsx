import { Pressable, FlatList, Modal, Platform } from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";
import type { SelectOption } from "./types";

interface NativeModalProps {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  options: SelectOption[];
  tempValue: string;
  onTempChange: (value: string) => void;
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
            <View
              className="flex-row justify-between items-center mb-2"
              style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
            >
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="px-3 py-2"
                android_ripple={rippleConfig}
              >
                <Text className="text-base text-fg dark:text-fg-dark">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onDone();
                }}
                className="px-3 py-2"
                android_ripple={rippleConfig}
              >
                <Text className="text-base text-link">Done</Text>
              </Pressable>
            </View>

            {Platform.OS === "ios" ? (
              <IOSPicker
                options={options}
                tempValue={tempValue}
                onTempChange={onTempChange}
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
                onTempChange={onTempChange}
                isRTL={isRTL}
                rippleConfig={rippleConfig}
              />
            )}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function IOSPicker({
  options,
  tempValue,
  onTempChange,
  isRTL,
  theme,
  placeholder,
  selectedOption,
  firstValue,
}: any) {
  try {
    const Picker = require("@react-native-picker/picker").Picker;
    const color = theme === "dark" ? "#FFFFFF" : "#0B0B0C";

    return (
      <Picker
        selectedValue={String(tempValue ?? firstValue)}
        onValueChange={onTempChange}
        style={{ color, writingDirection: isRTL ? "rtl" : "ltr" }}
        itemStyle={{ color, writingDirection: isRTL ? "rtl" : "ltr" }}
      >
        {!selectedOption && placeholder && (
          <Picker.Item
            label={placeholder}
            value={firstValue}
            color={theme === "dark" ? "#AFAFAF" : "#6B7280"}
          />
        )}
        {options.map((opt: SelectOption) => (
          <Picker.Item
            key={opt.value}
            label={opt.label}
            value={opt.value}
            color={color}
          />
        ))}
      </Picker>
    );
  } catch {
    return (
      <Text className="text-danger dark:text-danger">
        Missing @react-native-picker/picker
      </Text>
    );
  }
}

function AndroidList({
  options,
  tempValue,
  onTempChange,
  isRTL,
  rippleConfig,
}: any) {
  return (
    <FlatList
      style={{ maxHeight: 320 }}
      data={options}
      keyExtractor={(o) => o.value}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => {
        const active = item.value === tempValue;
        return (
          <Pressable
            className={cn(
              "px-3 py-3 flex-row items-center justify-between",
              active
                ? "bg-light-cyan dark:bg-black"
                : "bg-surface dark:bg-black",
            )}
            onPress={(e) => {
              e.stopPropagation();
              onTempChange(item.value);
            }}
            android_ripple={rippleConfig}
          >
            <Text
              className="text-base text-fg dark:text-fg-dark flex-1"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
                textAlign: isRTL ? "right" : "left",
              }}
              numberOfLines={1}
            >
              {item.label}
            </Text>
            {active && (
              <Text className="text-base text-fg dark:text-fg-dark">✓</Text>
            )}
          </Pressable>
        );
      }}
      ItemSeparatorComponent={() => (
        <View
          className="h-px bg-border dark:bg-border-dark"
          children={undefined}
        />
      )}
    />
  );
}
