/** Shared horizontal bounds for workspace content + vault dock. */
export const WORKSPACE_CONTENT_MAX_WIDTH = 1280;
export const VAULT_DOCK_MAX_WIDTH = 920;
export const WORKSPACE_EDGE_PADDING = 16;
export const WORKSPACE_EDGE_PADDING_MD = 24;

export function workspaceEdgePadding(windowWidth: number) {
  return windowWidth >= 768
    ? WORKSPACE_EDGE_PADDING_MD
    : WORKSPACE_EDGE_PADDING;
}

/** Inner content width inside the padded, max-width column. */
export function workspaceInnerWidth(windowWidth: number) {
  const pad = workspaceEdgePadding(windowWidth);
  const outer = Math.min(Math.max(windowWidth, 0), WORKSPACE_CONTENT_MAX_WIDTH);
  return Math.max(outer - pad * 2, 0);
}
