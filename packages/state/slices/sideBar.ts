// slices/sidebar.ts
export type Sidebar = {
  isOpen: boolean;
};

export type SidebarSlice = {
  sidebar: Sidebar;
  toggleSidebar: () => void;
  setSidebar: (v: Sidebar) => void;
};

export const createSidebarSlice = (
  set: any,
  get: any,
  store: any,
): SidebarSlice => ({
  sidebar: { isOpen: false },

  toggleSidebar: () =>
    set((state: any) => ({
      sidebar: { isOpen: !state.sidebar.isOpen },
    })),

  setSidebar: (v: Sidebar) => set({ sidebar: v }),
});
