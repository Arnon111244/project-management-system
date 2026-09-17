import React from "react";
import {
  SafeAreaView as RNSafeAreaView,
  SafeAreaViewProps as RNSafeAreaViewProps,
} from "react-native-safe-area-context";
import { cssInterop } from "nativewind";
import { cn } from "ui/utils/cn";

interface SafeAreaProps extends RNSafeAreaViewProps {
  children: React.ReactNode;
  className?: string;
}

cssInterop(RNSafeAreaView, {
  className: "style",
});

export const SafeAreaView = React.forwardRef<
  React.ComponentRef<typeof RNSafeAreaView>,
  SafeAreaProps
>(({ children, className, ...props }, ref) => {
  return (
    <RNSafeAreaView
      ref={ref}
      className={cn("bg-surface dark:bg-dark flex-1", className)}
      {...props}
    >
      {children}
    </RNSafeAreaView>
  );
});

SafeAreaView.displayName = "SafeAreaView";

export default SafeAreaView;
