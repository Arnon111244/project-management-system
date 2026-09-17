import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "ui/components/view";
import { cn } from "ui/utils/cn";
import { LineChart, Wallet2, User } from "lucide-react-native";
import { useNavigationState } from "@react-navigation/native";
import { TopButtonBar } from "./topButtonBar";
import { NavItem } from "../nav";
import { AvatarProfile } from "ui/components/avatarProfile";
import { NotificationsDropdown } from "ui/components/notificationsDropdown";

export const WEB_TOP_BAR_HEIGHT = 50;

export function WebTopBarSpacer({ className }: { className?: string }) {
  if (Platform.OS !== "web") return null;

  return (
    <View
      className={cn(
        "w-full",
        `h-[calc(${WEB_TOP_BAR_HEIGHT}px+max(env(safe-area-inset-top,0px),8px))]`,
        className,
      )}
    />
  );
}

export function TopBar() {
  const DEFAULT_ITEMS: NavItem[] = [
    {
      key: "portfolio",
      labelKey: "analytics",
      icon: LineChart,
      path: "/home",
    },
    {
      key: "wallet",
      labelKey: "accounts",
      icon: Wallet2,
      path: "/profile",
      isAnimationActive: true,
    },
    {
      key: "user",
      labelKey: "user",
      icon: User,
      path: "",
      isAnimationActive: true,
    },
    {
      key: "bell",
      labelKey: "bell",
      icon: NotificationsDropdown,
      path: "",
      isAnimationActive: false,
    },

    {
      key: "AvatarProfile",
      labelKey: "AvatarProfile",
      icon: AvatarProfile,
      path: "",
      isAnimationActive: false,
    },
  ];
  const slots = [...DEFAULT_ITEMS];

  const path =
    Platform.OS === "web"
      ? window.location.pathname
      : useNavigationState((state) => {
          const route = state?.routes?.[state.index];
          return route?.name ? `/${route.name.toLowerCase()}` : "/";
        });

  const safeNavigate = (to: string) => {
    if (Platform.OS === "web") {
      window.history.pushState({}, "", to);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      console.warn("Error !!");
    }
  };

  return (
    <>
      {Platform.OS === "web" && (
        <View
          className={cn(
            "fixed top-0 left-0 right-0 z-20",
            "mx-auto w-full",
            "flex-row items-center justify-between",
            "px-3",
            "bg-white dark:bg-black",
            "border-b border-border dark:border-border-dark",
            // "shadow-sm",
            "pt-[max(env(safe-area-inset-top,0px),8px)]",
          )}
          style={{
            height: WEB_TOP_BAR_HEIGHT,
          }}
        >
          <View className="flex-row justify-center px-2 mx-6" />
          <View className="flex flex-row mx-2">
            {slots.map((slot) => {
              const active = path === slot.path;
              return (
                <TopButtonBar
                  key={slot.key}
                  item={slot}
                  active={active}
                  disabled={active}
                  onPress={() => safeNavigate(String(slot.path))}
                />
              );
            })}
          </View>
        </View>
      )}

      {Platform.OS !== "web" && (
        <SafeAreaView
          edges={["top"]}
          className={cn(
            "absolute top-0 left-0 right-0 z-50",
            "w-full",
            "flex-row items-center justify-between",
            "bg-white dark:bg-black",
            "border-b border-border dark:border-border-dark",
          )}
        >
          <View className="flex-row justify-center" />
          <View className="flex flex-row mx-6">
            {slots.map((slot) => {
              const active = path === slot.path;
              return (
                <TopButtonBar
                  key={slot.key}
                  item={slot}
                  active={active}
                  disabled={active}
                  onPress={() => safeNavigate(String(slot.path))}
                />
              );
            })}
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
