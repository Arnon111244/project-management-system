import { useEffect } from "react";
import { Pressable, FlatList, Platform } from "react-native";
import { View } from "ui/components/view";
import type { SelectOption } from "./types";

interface WebDropdownProps {
  anchor: { left: number; top: number; width: number } | null;
  maxHeight: number;
  options: SelectOption[];
  onClose: () => void;
  renderItem: any;
  keyExtractor: (item: SelectOption) => string;
  isOpen: boolean;
}

export function WebDropdown({
  anchor,
  maxHeight,
  options,
  onClose,
  renderItem,
  keyExtractor,
  isOpen,
}: WebDropdownProps) {
  if (Platform.OS !== "web") return null;
  useEffect(() => {
    window.addEventListener("scroll", onClose);
    return () => window.removeEventListener("scroll", onClose);
  }, [isOpen]);

  try {
    const ReactDOM: any = require("react-dom");
    const { left = 0, top = 0, width = 260 } = anchor ?? {};
    const scrollYVal1 = window.scrollY;
    return ReactDOM.createPortal(
      <>
        <Pressable
          className="fixed inset-0"
          style={{ zIndex: 9998 }}
          onPress={onClose}
        />
        <View
          className="fixed"
          style={{
            left,
            top: top - scrollYVal1,
            width,
            zIndex: 9999,
            pointerEvents: "box-none",
          }}
        >
          <View
            className="rounded-lg overflow-hidden border border-border dark:border-border-dark bg-surface dark:bg-black web:[box-shadow:0_8px_30px_rgba(0,0,0,0.12)]"
            style={{ pointerEvents: "auto" }}
          >
            <FlatList
              style={{ maxHeight }}
              data={options}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ItemSeparatorComponent={() => (
                <View
                  className="h-px bg-border dark:bg-border-dark"
                  children={undefined}
                />
              )}
            />
          </View>
        </View>
      </>,
      (globalThis as any).document?.body,
    );
  } catch {
    return null;
  }
}
