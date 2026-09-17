import React, { memo, useMemo, useState } from "react";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";
import { useWindowDimensions, Pressable } from "react-native";
import { useActivePath, safeNavigate, pathsEqual } from "../utils";
import { ButtonWebSideBar } from "./buttonWebSideBar";
import { NavItem } from "../nav";
import { getDefaultNavItems, APP_BRAND_NAME } from "../defaultNavItems";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { colors } from "ui/theme";
import { useGlobalStore } from "state/index";
import { HamburgerToggle } from "ui/components/hamburgerToggle";
import { BrandLogoMark } from "ui/components/brandLogoMark";

type Props = {
  onNavigateError?: (e: unknown) => void;
  className?: string;
  currentPath?: string;
};

export function WebSideBarComponent({
  onNavigateError,
  className,
  currentPath,
}: Props) {
  const { width } = useWindowDimensions();

  const isOpen = useGlobalStore((s) => s.sidebar.isOpen);
  const toggleSidebar = useGlobalStore((s) => s.toggleSidebar);
  const path = useActivePath(currentPath);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    if (isOpen && width < 900) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, width]);

  const DEFAULT_ITEMS: NavItem[] = useMemo(() => getDefaultNavItems(), []);

  React.useEffect(() => {
    DEFAULT_ITEMS.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          pathsEqual(path, child.path),
        );
        if (hasActiveChild && !openMenus.includes(item.key)) {
          setOpenMenus((prev) => [...prev, item.key]);
        }
      }
    });
  }, [path]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };
  return (
    <>
      {isOpen && width < 900 && (
        <Pressable
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onPress={toggleSidebar}
        />
      )}

      <View
        className={cn(
          "h-screen overflow-y-scroll overflow-x-hidden w-[272px] min-w-[272px] max-w-[272px] sticky top-0 shrink-0 bg-surface dark:bg-black z-40 transition-all duration-300 border-e border-border dark:border-[#2A2A2A]",
          isOpen
            ? `${width < 900 && "fixed "} inset-0 w-[272px] bg-white dark:bg-black shadow-sm left-0`
            : "w-[0px] fixed -left-full",
          className,
        )}
      >
        <View className="rounded-3xl p-5 px-2">
          <View className="flex-col items-center gap-2 mb-3">
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

        <View className="gap-1.5 mx-2">
          {DEFAULT_ITEMS.map((it) => {
            const hasChildren =
              Array.isArray(it.children) && it.children.length > 0;
            const menuIsOpen = openMenus.includes(it.key);
            const active =
              it.path && !hasChildren ? pathsEqual(path, it.path) : false;

            return (
              <View key={it.key}>
                <ButtonWebSideBar
                  item={it}
                  active={active}
                  disabled={false}
                  onPress={async () => {
                    if (hasChildren) return toggleMenu(it.key);
                    if (it.action) return it.action();
                    if (it.path)
                      (await safeNavigate(it.path, onNavigateError, path),
                        width < 900 && toggleSidebar());
                  }}
                  rightIcon={
                    hasChildren
                      ? menuIsOpen
                        ? ChevronDown
                        : ChevronRight
                      : undefined
                  }
                />
                {hasChildren && menuIsOpen && isOpen && (
                  <View className="ms-4 mt-1">
                    {it.children!.map((child) => {
                      const childActive = pathsEqual(path, child.path);
                      return (
                        <ButtonWebSideBar
                          key={child.key}
                          item={child}
                          active={childActive}
                          disabled={childActive}
                          onPress={async () => {
                            await safeNavigate(
                              child.path!,
                              onNavigateError,
                              path,
                            );
                            if (width < 900) {
                              toggleSidebar();
                            }
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

      <View
        className={cn(
          "fixed z-40 top-1 transition-all duration-300 ease-in-out bg-white dark:bg-black",
          isOpen ? "left-[285px]" : "left-[15px]",
        )}
      >
        <HamburgerToggle isOpen={isOpen} onToggle={toggleSidebar} />
      </View>
    </>
  );
}

export const WebSideBar = memo(WebSideBarComponent);
WebSideBar.displayName = "WebSideBar";
