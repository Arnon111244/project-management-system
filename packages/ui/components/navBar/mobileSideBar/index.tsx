import React, { useState, useMemo } from "react";
import { View } from "ui/components/view";
import { Pressable } from "react-native";
import { cn } from "ui/utils/cn";
import { Text } from "ui/components/text";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { useActivePath, safeNavigate, pathsEqual } from "../utils";
import { ButtonMobileSideBar } from "./buttonMobileSideBar";
import { NavItem } from "../nav";
import { getDefaultNavItems, APP_BRAND_NAME } from "../defaultNavItems";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "ui/theme";
import { useGlobalStore } from "state/index";
import { BrandLogoMark } from "ui/components/brandLogoMark";
type Props = {
  items?: NavItem[];
  onNavigateError?: (e: unknown) => void;
  currentPath?: string;
};

export function MobileSideBar({ onNavigateError, currentPath }: Props) {
  const isOpen = useGlobalStore((s) => s.sidebar.isOpen);
  const toggleSidebar = useGlobalStore((s) => s.toggleSidebar);

  const path = useActivePath(currentPath);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const DEFAULT_ITEMS: NavItem[] = useMemo(() => getDefaultNavItems(), []);
  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <SafeAreaView pointerEvents="box-none" style={{ zIndex: 200 }}>
      <View className="w-full">
        {isOpen && (
          <Pressable
            className="absolute inset-0 w-[700px] bg-black/40 z-1"
            onPress={toggleSidebar}
          />
        )}
        <View
          className={cn(
            "h-screen sticky top-0 w-[260px] shrink-0 p-3 z-11",
            "bg-surface dark:bg-black border-r border-border dark:border-[#2A2A2A]",
            "transform transition-transform duration-300",
            isOpen ? "translate-x-0 left-0" : "-translate-x-full left-0",
          )}
        >
          <View className="gap-1.5">
            <View className="rounded-3xl p-5 mb-2 ">
              <View className="flex-col items-center gap-2 mb-1">
                <View
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: 9999,
                    borderWidth: 2,
                    borderColor: colors.brand,
                    padding: 2,
                    backgroundColor: "#ffffff",
                  }}
                  className="items-center justify-center"
                >
                  <BrandLogoMark
                    className="h-[60px] w-[60px] rounded-full"
                    textClassName="text-2xl"
                  />
                </View>
                <Text className="text-xl font-bold text-black dark:text-white text-center">
                  {APP_BRAND_NAME}
                </Text>
              </View>
            </View>
            {DEFAULT_ITEMS.map((it) => {
              const hasChildren =
                Array.isArray(it.children) && it.children.length > 0;
              const isOpen = openMenus.includes(it.key);
              const active =
                it.path && !hasChildren ? pathsEqual(path, it.path) : false;

              return (
                <View key={it.key}>
                  <ButtonMobileSideBar
                    item={it}
                    active={active}
                    layout="side"
                    disabled={false}
                    onPress={() => {
                      if (hasChildren) return toggleMenu(it.key);

                      if (it.action) {
                        it.action();
                        return;
                      }
                      if (it.path) {
                        safeNavigate(it.path, onNavigateError, path);
                        toggleSidebar();
                      }
                    }}
                    rightIcon={
                      hasChildren
                        ? isOpen
                          ? ChevronDown
                          : ChevronRight
                        : undefined
                    }
                  />

                  {hasChildren && isOpen && (
                    <View className="ml-6 mt-1 space-y-1">
                      {it.children!.map((child) => {
                        const childActive = pathsEqual(path, child.path);
                        return (
                          <ButtonMobileSideBar
                            key={child.key}
                            item={child}
                            active={childActive}
                            layout="side"
                            disabled={childActive}
                            onPress={() => {
                              toggleSidebar();
                              safeNavigate(child.path!, onNavigateError, path);
                            }}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
