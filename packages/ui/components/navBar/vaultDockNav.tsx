import { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { getNavLabel } from "./nav";
import { cn } from "ui/utils/cn";

import type { NavItem } from "./nav";
import { pathsEqual, safeNavigate } from "./utils";
import { NEURAL } from "ui/theme/neuralRuntime";
import { useWorkspaceContentBounds } from "./workspaceContentBounds";
import {
  WORKSPACE_CONTENT_MAX_WIDTH,
  VAULT_DOCK_MAX_WIDTH,
  workspaceEdgePadding,
  workspaceInnerWidth,
} from "./workspaceLayout";

const ITEM_MIN_WIDTH = 60;
const ITEM_MIN_WIDTH_COMPACT = 52;
const DOCK_INNER_PADDING = 12;
const DOCK_BOTTOM_PADDING = 16;

/** Approximate dock pill height (for content bottom inset). */
export const VAULT_DOCK_HEIGHT = 56;

/** Bottom padding so scrollable content clears the floating vault dock. */
export function useVaultDockClearance(extra = 0) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const nativeFabClearance = Platform.OS === "web" ? 0 : 56;

  return (
    insets.bottom +
    VAULT_DOCK_HEIGHT +
    DOCK_BOTTOM_PADDING +
    workspaceEdgePadding(width) +
    extra
  );
}

type VaultDockNavProps = {
  items: NavItem[];
  currentPath?: string;
  onNavigateError?: (e: unknown) => void;
};

type DockNavItemProps = {
  label: string;
  icon?: NavItem["icon"];
  active: boolean;
  itemMinWidth: number;
  onPress: () => void;
};

function DockNavItem({
  label,
  icon: Icon,
  active,
  itemMinWidth,
  onPress,
}: DockNavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center py-2 px-0.5 rounded-xl shrink-0"
      style={{
        backgroundColor: active ? NEURAL.cyanSoft : "transparent",
        width: itemMinWidth,
      }}
    >
      {Icon ? (
        <Icon size={18} color={active ? NEURAL.cyan : NEURAL.textDim} />
      ) : null}
      <Text
        className="text-[9px] mt-1 font-medium text-center w-full"
        style={{ color: active ? NEURAL.cyan : NEURAL.textDim }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function VaultDockNav({
  items,
  currentPath,
  onNavigateError,
}: VaultDockNavProps) {
  const { width: windowWidth } = useWindowDimensions();
  const boundsCtx = useWorkspaceContentBounds();

  const itemMinWidth =
    windowWidth < 400 ? ITEM_MIN_WIDTH_COMPACT : ITEM_MIN_WIDTH;
  const contentMinWidth = items.length * itemMinWidth + DOCK_INNER_PADDING;

  const fallbackWidth = useMemo(
    () => workspaceInnerWidth(windowWidth),
    [windowWidth],
  );
  const columnWidth = boundsCtx?.bounds.width || fallbackWidth;
  const columnLeft =
    boundsCtx?.bounds.left || workspaceEdgePadding(windowWidth);

  const pillWidth = useMemo(() => {
    const maxAvailable = Math.min(columnWidth, VAULT_DOCK_MAX_WIDTH);
    return Math.min(contentMinWidth, maxAvailable);
  }, [columnWidth, contentMinWidth]);
  const pillLeft = useMemo(
    () => columnLeft + Math.max((columnWidth - pillWidth) / 2, 0),
    [columnLeft, columnWidth, pillWidth],
  );

  const visibleInnerWidth = Math.max(pillWidth - DOCK_INNER_PADDING, 0);
  const shouldScroll = contentMinWidth > visibleInnerWidth;

  const renderItems = () =>
    items.map((item) => {
      const active = pathsEqual(currentPath, item.path);
      const Icon = item.icon;
      const label = item.labelKey ? getNavLabel(item.labelKey) : item.key;

      return (
        <DockNavItem
          key={item.key}
          label={label}
          icon={Icon}
          active={active}
          itemMinWidth={itemMinWidth}
          onPress={() =>
            safeNavigate(String(item.path), onNavigateError, currentPath)
          }
        />
      );
    });

  const dockPill = (
    <View
      pointerEvents="auto"
      className="w-full rounded-[22px] border"
      style={{
        width: pillWidth,
        maxWidth: VAULT_DOCK_MAX_WIDTH,
        backgroundColor: NEURAL.dock,
        borderColor: NEURAL.border,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === "web"}
        scrollEnabled={shouldScroll}
        nestedScrollEnabled
        directionalLockEnabled
        bounces={false}
        className={cn("w-full", Platform.OS === "web" && "vault-dock-scroll")}
        style={{
          width: pillWidth,
          maxWidth: VAULT_DOCK_MAX_WIDTH,
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 22,
        }}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 6,
          paddingTop: 6,
          paddingBottom: Platform.OS === "web" && shouldScroll ? 8 : 6,
          ...(shouldScroll
            ? { minWidth: contentMinWidth }
            : {
                width: visibleInnerWidth,
                justifyContent: "center",
              }),
        }}
      >
        {renderItems()}
      </ScrollView>
    </View>
  );

  if (Platform.OS === "web" && pillWidth > 0) {
    return (
      <View
        pointerEvents="box-none"
        className="fixed bottom-0 z-50 pb-2"
        style={{
          left: pillLeft,
          width: pillWidth,
        }}
      >
        {dockPill}
      </View>
    );
  }

  return (
    <SafeAreaView
      pointerEvents="box-none"
      edges={["bottom"]}
      className="absolute bottom-0 left-0 right-0 z-50 items-center pb-2 md:pb-3"
    >
      <View
        className="w-full px-4 md:px-6 items-center"
        style={{ maxWidth: WORKSPACE_CONTENT_MAX_WIDTH }}
      >
        {dockPill}
      </View>
    </SafeAreaView>
  );
}
