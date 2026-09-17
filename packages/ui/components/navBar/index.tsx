import * as React from "react";
import { memo } from "react";
import { Platform } from "react-native";
import { useActivePath } from "./utils";
export { WEB_BOTTOM_BAR_HEIGHT } from "./bottomBar";
export { AppChrome, AppChromeSpacer } from "./appChrome";
export {
  VaultDockNav,
  useVaultDockClearance,
  VAULT_DOCK_HEIGHT,
} from "./vaultDockNav";
export {
  WorkspaceContentBoundsProvider,
  useWorkspaceContentBounds,
  useSetWorkspaceContentBounds,
} from "./workspaceContentBounds";
export {
  WORKSPACE_CONTENT_MAX_WIDTH,
  VAULT_DOCK_MAX_WIDTH,
  WORKSPACE_EDGE_PADDING,
  WORKSPACE_EDGE_PADDING_MD,
  workspaceEdgePadding,
  workspaceInnerWidth,
} from "./workspaceLayout";
import { getVaultDockItems } from "./defaultNavItems";
import { VaultDockNav } from "./vaultDockNav";
import { AppChrome, AppChromeSpacer } from "./appChrome";
import { NavItem } from "./nav";
import { View } from "ui/components/view";

type Props = {
  items?: NavItem[];
  className?: string;
  currentPath?: string;
  onNavigateError?: (e: unknown) => void;
};

function MainNav({ currentPath, onNavigateError, items }: Props) {
  useActivePath(currentPath);
  const dockItems = items ?? getVaultDockItems();

  return (
    <>
      <AppChrome />
      <AppChromeSpacer />

      <VaultDockNav
        items={dockItems}
        currentPath={currentPath}
        onNavigateError={onNavigateError}
      />
    </>
  );
}

export const NavBar = memo(MainNav);
NavBar.displayName = "NavBar";
