import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "ui/components/view";
import { cn } from "ui/utils/cn";
import { useActivePath } from "../utils";
import { BottomButtonBar } from "./bottomButtonBar";
import { NavItem } from "../nav";
export const WEB_BOTTOM_BAR_HEIGHT = 72;

type Props = {
  items: NavItem[];
  onNavigateError?: (e: unknown) => void;
  className?: string;
  currentPath?: string;
  safeNavigate: (
    to: string,
    onErr?: (e: unknown) => void,
    from?: string,
  ) => void;
};

export function BottomBar({
  items,
  onNavigateError,
  className,
  currentPath,
  safeNavigate,
}: Props) {
  const path = useActivePath(currentPath);
  const isWeb = Platform.OS === "web";

  const slots: Array<NavItem> = [...items];
  return (
    <SafeAreaView
      pointerEvents="box-none"
      edges={["bottom"]}
      className={cn(
        isWeb && "fixed bottom-0 left-0 right-0 z-50",
        "pb-0 mx-auto",
        className,
      )}
    >
      {/* <SafeAreaView
        pointerEvents="box-none"
        edges={["bottom"]}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "pt-0",
          className
        )}
      > */}
      <View
        pointerEvents="box-none"
        className={cn(
          "w-full ",
          isWeb && "pb-[max(env(safe-area-inset-bottom,0px),8px)]",
        )}
      >
        <View
          pointerEvents="auto"
          className={cn(
            "relative",
            "mx-auto w-full ",
            "flex-row items-stretch", // even spread
            "px-3 py-0",
            "bg-white dark:bg-black",
            "border-t border-b border-border dark:border-border-dark",
            "shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
          )}
          // style={{
          //   maxWidth: 1400,
          // }}
        >
          {slots.map((slot) => {
            const active = path === slot.path;
            return (
              <BottomButtonBar
                key={slot.key}
                item={slot}
                active={active}
                layout="bottom"
                disabled={active}
                onPress={() =>
                  safeNavigate(String(slot.path), onNavigateError, path)
                }
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
