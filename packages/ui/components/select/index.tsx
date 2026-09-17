import { Platform, Pressable } from "react-native";
import { cssInterop } from "nativewind";
import { cn } from "ui/utils/cn";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { useTheme } from "ui/theme/themeProvider";
import { Check } from "lucide-react-native";
import {
  ComponentRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { WebDropdown } from "./WebDropdown";
import { NativeModal } from "./NativeModal";
import type { SelectProps, SelectOption, SelectLayout } from "./types";

export type { SelectProps, SelectOption, SelectLayout };
function useIsRTL() {
  return false;
}
cssInterop(Pressable, { className: "style" });
cssInterop(View, { className: "style" });

function useIsOpenControlled() {
  const [open, setOpen] = useState(false);
  const openDropdown = useMemo(() => {
    let locked = false;
    return () => {
      if (locked) return;
      locked = true;
      setOpen(true);
      setTimeout(() => (locked = false), 250);
    };
  }, []);
  const closeDropdown = useCallback(() => setOpen(false), []);
  return { open, openDropdown, closeDropdown };
}

const SelectComponent = forwardRef<ComponentRef<typeof Pressable>, SelectProps>(
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
    const { open, openDropdown, closeDropdown } = useIsOpenControlled();
    const { effective } = useTheme();
    const isRTL = useIsRTL();
    const triggerRef = useRef<any>(null);
    type AnchorRect = {
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
    const [anchor, setAnchor] = useState<AnchorRect>(null);

    const firstValue = useMemo(() => options[0]?.value ?? "", [options]);
    const [tempNativeValue, setTempNativeValue] = useState<string>(
      selectedValue ?? firstValue,
    );
    useEffect(() => {
      if (!open) return;
      const exists = options.some((o) => o.value === tempNativeValue);
      if (!exists) setTempNativeValue(firstValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, options, firstValue]);

    useEffect(() => {
      setTempNativeValue((selectedValue ?? firstValue) as string);
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

    const showError = !!error;
    const isDisabled = !!disabled;

    const displayText = selectedOption?.label ?? placeholder;

    // web-only anchor updates
    const [, setWindowTick] = useState(0);
    const resizeTimeout = useRef<number | null>(null);
    const updateAnchorRect = useCallback(() => {
      if (Platform.OS !== "web") return;
      try {
        const el: any = triggerRef.current as any;
        const rect = el?.getBoundingClientRect?.();
        if (rect) {
          setAnchor({
            left: rect.left + (window?.scrollX ?? 0),
            top: rect.top + rect.height + (window?.scrollY ?? 0),
            width: rect.width,
            height: rect.height,
          });
          setWindowTick((t) => t + 1);
        }
      } catch {}
    }, []);
    useEffect(() => {
      if (Platform.OS !== "web") return;

      const handler = () => {
        if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current);
        resizeTimeout.current = window.setTimeout(() => {
          updateAnchorRect();
          resizeTimeout.current = null;
        }, 70) as unknown as number;
      };

      if (open) {
        updateAnchorRect();
        window.addEventListener("resize", handler);
        window.addEventListener("scroll", handler, true);
      }
      return () => {
        if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current);
        window.removeEventListener("resize", handler);
        window.removeEventListener("scroll", handler, true);
      };
    }, [open, updateAnchorRect]);

    // renderers
    const keyExtractor = useCallback((item: SelectOption) => item.value, []);
    const itemRenderer = useCallback(
      ({ item }: { item: SelectOption }) => {
        const active = item.value === selectedValue;
        return (
          <Pressable
            className={cn(
              // keep layout consistent; writingDirection handles text
              "px-3 py-2 flex-row items-center justify-between",
              active
                ? "bg-light-cyan dark:bg-black"
                : "bg-surface dark:bg-black",
              "web:hover:bg-muted dark:web:hover:bg-muted-dark",
            )}
            onPress={() => {
              onValueChange?.(item.value);
              closeDropdown();
            }}
            android_ripple={androidRippleConfig}
          >
            <Text
              className="text-sm text-fg dark:text-fg-dark flex-1"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
                textAlign: isRTL ? "right" : "left",
              }}
              numberOfLines={1}
            >
              {item.label}
            </Text>
            {active && Platform.OS === "web" ? (
              <Check
                size={16}
                className="text-fg dark:text-fg-dark"
                aria-hidden
              />
            ) : null}
          </Pressable>
        );
      },
      [selectedValue, onValueChange, closeDropdown, androidRippleConfig, isRTL],
    );

    const triggerClasses = useMemo(
      () =>
        cn(
          "relative z-10",
          "flex flex-row items-center",
          "w-full rounded-md h-10 px-3",
          "text-base md:text-sm text-fg dark:text-fg-dark",
          "bg-surface dark:bg-charcoal border border-border dark:border-border-dark",
          !showError &&
            "web:[box-shadow:0_1px_2px_rgba(0,0,0,0.05)] web:focus:[box-shadow:0_0_0_3px_rgba(163,163,163,0.4),0_1px_2px_rgba(0,0,0,0.05)]",
          showError && "border-danger dark:border-danger",
          isDisabled && "opacity-70 web:cursor-not-allowed",
          "web:[outline:none]",
          className,
        ),
      [showError, isDisabled, className],
    );

    const helpTextClass = useMemo(
      () =>
        cn(
          "mt-1 text-xs",
          showError
            ? "text-danger dark:text-danger"
            : "text-fg dark:text-fg-dark opacity-60",
        ),
      [showError],
    );

    const renderDropdown = () => {
      if (Platform.OS === "web") {
        return (
          <WebDropdown
            anchor={anchor}
            maxHeight={maxDropdownHeight}
            options={options}
            onClose={closeDropdown}
            renderItem={itemRenderer}
            keyExtractor={keyExtractor}
          />
        );
      }

      return (
        <NativeModal
          open={open}
          onClose={closeDropdown}
          onDone={() => {
            onValueChange?.(tempNativeValue);
            closeDropdown();
          }}
          options={options}
          tempValue={tempNativeValue}
          onTempChange={setTempNativeValue}
          isRTL={isRTL}
          rippleConfig={androidRippleConfig}
          theme={effective}
          placeholder={placeholder}
          selectedOption={selectedOption}
          firstValue={firstValue}
        />
      );
    };

    const body = (
      <View className="w-full">
        {!!label && (
          <Text
            className="block text-sm font-medium text-fg dark:text-fg-dark mb-1"
            style={{
              writingDirection: isRTL ? "rtl" : "ltr",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {label}
            {required && <Text className="text-danger ps-0.5">*</Text>}
          </Text>
        )}

        <Pressable
          ref={(node) => {
            triggerRef.current = node as any;
            if (typeof ref === "function") ref(node as any);
            else if (ref && typeof ref === "object")
              (ref as any).current = node;
          }}
          disabled={isDisabled || open}
          className={triggerClasses}
          accessibilityRole="button"
          onPress={() => {
            if (isDisabled) return;
            if (Platform.OS === "web") {
              try {
                const el: any = triggerRef.current as any;
                const rect = el?.getBoundingClientRect?.();
                if (rect) {
                  setAnchor({
                    left: rect.left + (window?.scrollX ?? 0),
                    top: rect.top + rect.height + (window?.scrollY ?? 0),
                    width: rect.width,
                    height: rect.height,
                  });
                }
              } catch {}
            }
            openDropdown();
          }}
        >
          <View className="flex-1">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className={cn(
                "text-base md:text-sm leading-none",
                "text-fg dark:text-fg-dark",
                !selectedOption && "opacity-60",
              )}
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {displayText}
            </Text>
          </View>

          <View className="h-full justify-start items-center p-2 pr-0">
            <Text
              aria-hidden
              className="text-lg leading-none text-fg/40 dark:text-fg-dark/40"
            >
              ⌄
            </Text>
          </View>
        </Pressable>

        {(description || showError) && (
          <Text
            className={helpTextClass}
            style={{
              writingDirection: isRTL ? "rtl" : "ltr",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {showError ? error : description}
          </Text>
        )}

        {open && renderDropdown()}
      </View>
    );

    if (layout === "horizontal") {
      return (
        <View className="w-full">
          <View className="flex-row items-center gap-2">
            <View className={cn("h-10 justify-center", labelWidthClassName)}>
              {!!label && (
                <Text
                  className="text-sm font-medium text-fg dark:text-fg-dark"
                  style={{
                    writingDirection: isRTL ? "rtl" : "ltr",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {label}
                  {required && <Text className="text-danger ps-0.5">*</Text>}
                </Text>
              )}
            </View>
            <View className={cn("min-w-0 w-full", inputWrapperClassName)}>
              {body}
            </View>
          </View>
        </View>
      );
    }

    return body;
  },
);

SelectComponent.displayName = "Select";
export const Select = memo(SelectComponent);
export default Select;
