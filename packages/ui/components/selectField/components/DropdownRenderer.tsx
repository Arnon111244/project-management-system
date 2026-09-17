import React from "react";
import { Platform } from "react-native";
import { WebDropdown } from "../WebDropdown";
import { NativeModal } from "../NativeModal";
import type { SelectOption } from "../types";

type Props = {
  isOpen: boolean;
  anchor: any;
  maxHeight: number;
  options: SelectOption[];
  onClose: () => void;
  onValueChange?: (val: string) => void;
  tempNativeValue: string;
  setTempNativeValue: (val: string) => void;
  isRTL: boolean;
  rippleConfig: any;
  theme: string;
  placeholder: string;
  selectedOption: SelectOption | null;
  firstValue: string;
  renderItem: (item: { item: SelectOption }) => React.ReactElement;
  keyExtractor: (item: SelectOption) => string;
};

export function DropdownRenderer({
  isOpen,
  anchor,
  maxHeight,
  options,
  onClose,
  onValueChange,
  tempNativeValue,
  setTempNativeValue,
  isRTL,
  rippleConfig,
  theme,
  placeholder,
  selectedOption,
  firstValue,
  renderItem,
  keyExtractor,
}: Props) {
  if (Platform.OS === "web") {
    return (
      <WebDropdown
        isOpen={isOpen}
        anchor={anchor}
        maxHeight={maxHeight}
        options={options}
        onClose={onClose}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    );
  }

  return (
    <NativeModal
      open={isOpen}
      onClose={onClose}
      onDone={(param) => {
        onValueChange?.(param);
        onClose();
      }}
      options={options}
      tempValue={tempNativeValue}
      onTempChange={setTempNativeValue}
      isRTL={isRTL}
      rippleConfig={rippleConfig}
      theme={theme as "dark" | "light"}
      placeholder={placeholder}
      selectedOption={selectedOption}
      firstValue={firstValue}
    />
  );
}
