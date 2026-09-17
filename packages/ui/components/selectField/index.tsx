import React, {
  forwardRef,
  memo,
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Platform, Pressable } from "react-native";
import { cssInterop } from "nativewind";
import { cn } from "ui/utils/cn";
import { useTheme } from "ui/theme/themeProvider";
import { View } from "ui/components/view";
import { useIsRTL } from "./hooks/useIsRTL";
import { useIsOpenControlled } from "./hooks/useIsOpenControlled";
import { useAnchorPosition } from "./utils/anchorUtils";
import { OptionItem } from "./components/OptionItem";
import { DropdownRenderer } from "./components/DropdownRenderer";
import { SelectBody } from "./components/SelectBody";
import type { SelectProps, SelectOption } from "./types";

cssInterop(Pressable, { className: "style" });
cssInterop(View, { className: "style" });

const SelectComponent = forwardRef<any, SelectProps>(
  (
    {
      label,
      description,
      error,
      required,
      layout = "stacked",
      labelWidthClassName = "w-28",
      inputWrapperClassName = "flex-1",
      className,
      placeholder = "Select...",
      selectedValue,
      onValueChange,
      options,
      disabled,
      maxDropdownHeight = 256,
    },
    ref,
  ) => {
    const { effective } = useTheme();
    const isRTL = useIsRTL();
    const { open, openDropdown, closeDropdown } = useIsOpenControlled();

    const triggerRef = useRef<any>(null);
    const { anchor, updateAnchorRect } = useAnchorPosition(open, triggerRef);

    const firstValue = useMemo(() => options[0]?.value ?? "", [options]);
    const [tempNativeValue, setTempNativeValue] = useState(
      selectedValue ?? firstValue,
    );

    useEffect(() => {
      if (!open) return;
      const exists = options.some((o) => o.value === tempNativeValue);
      if (!exists) setTempNativeValue(firstValue);
    }, [open, options, firstValue]);

    useEffect(() => {
      setTempNativeValue(selectedValue ?? firstValue);
    }, [selectedValue, firstValue]);

    const selectedOption = useMemo(
      () => options.find((o) => o.value === selectedValue) ?? null,
      [options, selectedValue],
    );

    const androidRippleConfig = useMemo(
      () =>
        Platform.OS === "android"
          ? {
              color:
                effective === "dark"
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.08)",
              borderless: false,
            }
          : undefined,
      [effective],
    );

    const triggerClasses = useMemo(
      () =>
        cn(
          "relative z-10 flex flex-row items-center w-full rounded-md h-10 px-3",
          "text-base md:text-sm text-fg dark:text-fg-dark bg-white dark:bg-black border border-border dark:border-border-dark",
          !error &&
            "web:[box-shadow:0_1px_2px_rgba(0,0,0,0.05)] web:focus:[box-shadow:0_0_0_3px_rgba(163,163,163,0.4),0_1px_2px_rgba(0,0,0,0.05)]",
          error && "border-danger dark:border-danger",
          disabled && "opacity-70 web:cursor-not-allowed",
          "web:[outline:none]",
          className,
        ),
      [error, disabled, className],
    );

    const helpTextClass = useMemo(
      () =>
        cn(
          "mt-1 text-xs",
          error
            ? "text-danger dark:text-danger"
            : "text-fg dark:text-fg-dark opacity-60",
        ),
      [error],
    );
    const displayText = selectedOption?.label ?? placeholder;

    const renderDropdown = () => (
      <DropdownRenderer
        isOpen={open}
        anchor={anchor}
        maxHeight={maxDropdownHeight}
        options={options}
        onClose={closeDropdown}
        onValueChange={onValueChange}
        tempNativeValue={tempNativeValue}
        setTempNativeValue={setTempNativeValue}
        isRTL={isRTL}
        rippleConfig={androidRippleConfig}
        theme={effective}
        placeholder={placeholder}
        selectedOption={selectedOption}
        firstValue={firstValue}
        renderItem={({ item }) => (
          <OptionItem
            item={item}
            selectedValue={selectedValue ?? undefined}
            androidRippleConfig={androidRippleConfig}
            onSelect={(val) => {
              onValueChange?.(val);
              closeDropdown();
            }}
            isRTL={isRTL}
          />
        )}
        keyExtractor={(item: SelectOption) => item.value}
      />
    );

    return (
      <SelectBody
        label={label}
        required={required}
        isRTL={isRTL}
        isDisabled={!!disabled}
        triggerRef={triggerRef}
        triggerClasses={triggerClasses}
        displayText={displayText}
        selectedOption={selectedOption}
        effective={effective}
        onPress={() => {
          if (disabled) return;
          if (Platform.OS === "web") updateAnchorRect();
          openDropdown();
        }}
        description={description}
        showError={!!error}
        helpTextClass={helpTextClass}
        error={error}
        renderDropdown={renderDropdown}
        open={open}
        layout={layout}
        labelWidthClassName={labelWidthClassName}
        inputWrapperClassName={inputWrapperClassName}
      />
    );
  },
);

SelectComponent.displayName = "Select";
export const Select = memo(SelectComponent);
export default Select;
