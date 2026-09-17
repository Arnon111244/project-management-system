import type { ReactNode } from "react";
import { useCallback } from "react";
import type { GestureResponderEvent } from "react-native";
import {
  Keyboard,
  Pressable,
  TextInput,
  UIManager,
  findNodeHandle,
} from "react-native";
import { cssInterop } from "nativewind";

cssInterop(Pressable, { className: "style" });

export interface KeyboardDismissSurfaceProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function KeyboardDismissSurface({
  children,
  className,
  disabled = false,
}: KeyboardDismissSurfaceProps) {
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;

      const state: any = TextInput.State;
      const focusedInput = state?.currentlyFocusedInput?.();

      const focusedTag = (() => {
        if (typeof focusedInput === "number") return focusedInput;
        if (focusedInput) {
          const nodeHandle = findNodeHandle(focusedInput);
          return typeof nodeHandle === "number" ? nodeHandle : null;
        }
        return null;
      })();

      const targetTag =
        typeof event?.nativeEvent?.target === "number"
          ? (event.nativeEvent.target as number)
          : null;

      if (
        typeof focusedTag === "number" &&
        typeof targetTag === "number" &&
        focusedTag === targetTag
      ) {
        return;
      }

      // Check if target is a descendant of focused input
      if (
        typeof focusedTag === "number" &&
        typeof targetTag === "number" &&
        typeof (UIManager as any)?.viewIsDescendantOf === "function"
      ) {
        try {
          const isDescendant = (UIManager as any).viewIsDescendantOf(
            targetTag,
            focusedTag,
          );
          if (isDescendant) {
            return;
          }
        } catch (error) {
          // viewIsDescendantOf can fail on certain RN versions, ignore and proceed
        }
      }

      if (focusedInput && typeof state?.blurTextInput === "function") {
        state.blurTextInput(focusedInput);
      }

      Keyboard.dismiss();
    },
    [disabled],
  );

  return (
    <Pressable
      onPress={handlePress}
      className={className || "flex-1"}
      android_disableSound
      accessible={false}
    >
      {children}
    </Pressable>
  );
}

export default KeyboardDismissSurface;
