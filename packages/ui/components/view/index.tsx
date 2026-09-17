import {
  View as ReactNativeView,
  ViewProps as RNViewProps,
} from "react-native";
import { cssInterop } from "nativewind";
import { cn } from "ui/utils/cn";
import React from "react";

interface ViewProps extends RNViewProps {
  children?: React.ReactNode;
  className?: string;
}

function withoutWhitespaceTextNodes(
  children: React.ReactNode,
): React.ReactNode {
  return React.Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );
}

cssInterop(ReactNativeView, {
  className: "style",
});

export const View = React.forwardRef<
  React.ComponentRef<typeof ReactNativeView>,
  ViewProps
>(({ children, className, ...props }, ref) => {
  return (
    <ReactNativeView ref={ref} className={cn(className)} {...props}>
      {children != null ? withoutWhitespaceTextNodes(children) : null}
    </ReactNativeView>
  );
});

View.displayName = "View";
