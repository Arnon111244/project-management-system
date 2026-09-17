import { useEffect, useCallback } from "react";
import { Pressable, Platform } from "react-native";
import { View } from "ui/components/view";

interface WebDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
  className?: string;
  maxWidth?: string;
  preventBodyScroll?: boolean;
}

export function WebDialog({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-[450px]",
  backgroundColor = "#00000040",
  className = "",
  preventBodyScroll = true,
}: WebDialogProps) {
  if (Platform.OS !== "web" || !isOpen) return null;

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, preventBodyScroll]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropPress = useCallback(
    (event: any) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleContentPress = useCallback((event: any) => {
    event.stopPropagation();
  }, []);

  try {
    const ReactDOM: any = require("react-dom");
    return ReactDOM.createPortal(
      <>
        <Pressable
          className="fixed inset-0"
          style={{
            zIndex: 1050,
            backgroundColor,
          }}
          onPress={handleBackdropPress}
        />

        <View className="fixed inset-0 z-[1051] pointer-events-none justify-center items-center p-5">
          <Pressable
            onPress={handleContentPress}
            className={`bg-surface dark:bg-black rounded-lg web:[box-shadow:0_25px_50px_rgba(0,0,0,0.25)] relative w-full ${maxWidth} mx-auto flex flex-col justify-center items-center ${className}`}
            style={{
              pointerEvents: "auto",
            }}
          >
            <View className="w-full flex flex-col justify-center items-center flex-1">
              {children}
            </View>
          </Pressable>
        </View>
      </>,
      (globalThis as any).document?.body,
    );
  } catch (error) {
    console.error("WebDialog render error:", error);
    return null;
  }
}
