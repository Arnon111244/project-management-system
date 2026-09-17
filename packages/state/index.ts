// Composed Zustand global store
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createToastSlice, type ToastSlice } from "./slices/toast";
import { createSidebarSlice, type SidebarSlice } from "./slices/sideBar";
import {
  createEnvironmentSlice,
  getInitialEnvironment,
  type EnvironmentSlice,
} from "./slices/environment";

export type { Environment } from "./slices/environment";

export type GlobalState = EnvironmentSlice &
  SidebarSlice &
  ToastSlice & {
    hydrated: boolean;
    setHydrated: (v: boolean) => void;
  };

function getStorage() {
  if (typeof window !== "undefined" && window.localStorage) {
    return createJSONStorage(() => localStorage);
  }
  return createJSONStorage(() => AsyncStorage);
}

const STORAGE_NAME = `ReactOne-storage-${getInitialEnvironment()}`;

export function clearAllPersistedKeys() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(STORAGE_NAME);
    } else if (typeof AsyncStorage !== "undefined" && AsyncStorage.removeItem) {
      try {
        AsyncStorage.removeItem(STORAGE_NAME);
      } catch {}
    }
  } catch {}
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => {
      const environmentSlice = createEnvironmentSlice();
      const sidebarSlice = createSidebarSlice(set, get, undefined);
      const toastSlice = createToastSlice(set, get, undefined);

      return {
        ...environmentSlice,
        ...sidebarSlice,
        ...toastSlice,

        setEnvironment: (env) => {
          const currentEnv = get().environment;
          if (currentEnv !== env) {
            set({ environment: env });
            try {
              clearAllPersistedKeys();
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                try {
                  const DevSettings = require("react-native").DevSettings;
                  if (DevSettings && DevSettings.reload) DevSettings.reload();
                } catch {}
              }
            } catch {}
          }
        },

        hydrated: false,
        setHydrated: (v) => set({ hydrated: v }),
      };
    },
    {
      name: STORAGE_NAME,
      storage: getStorage(),
      partialize: () => ({}),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const configEnv = getInitialEnvironment();
          if (
            state.environment !== undefined &&
            state.environment !== configEnv
          ) {
            try {
              clearAllPersistedKeys();
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                try {
                  const DevSettings = require("react-native").DevSettings;
                  if (DevSettings && DevSettings.reload) DevSettings.reload();
                } catch {}
              }
            } catch {}
            return;
          }
          state.setHydrated(true);
        }
      },
    },
  ),
);

export const selectors = {
  environment: (s: GlobalState) => s.environment,
  hydrated: (s: GlobalState) => s.hydrated,
  sidebar: (s: GlobalState) => s.sidebar,
  isSidebarOpen: (s: GlobalState) => s.sidebar.isOpen,
  toast: (s: GlobalState) => s.toast,
};
