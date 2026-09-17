import React, { memo } from "react";
import { Platform } from "react-native";
import { WebDialog } from "./WebDialog";
import { NativeDialog } from "./NativeDialog";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
  maxWidth?: string;
}

function DialogComponent({
  isOpen,
  onClose,
  children,
  backgroundColor,
  maxWidth,
}: DialogProps) {
  if (!isOpen) return null;

  if (Platform.OS === "web") {
    return (
      <WebDialog
        isOpen={isOpen}
        onClose={onClose}
        backgroundColor={backgroundColor}
        maxWidth={maxWidth}
      >
        {children}
      </WebDialog>
    );
  }

  return (
    <NativeDialog isOpen={isOpen} onClose={onClose}>
      {children}
    </NativeDialog>
  );
}

export const Dialog = memo(DialogComponent);
