import { useEffect } from "react";
import { Platform } from "react-native";
import { useGlobalStore, selectors } from "state";
import type { Environment } from "state/slices/environment";

export function useEnvironmentSync() {
  const setEnvironment = useGlobalStore((s) => s.setEnvironment);
  const hydrated = useGlobalStore(selectors.hydrated);
  const currentEnv = useGlobalStore(selectors.environment);

  useEffect(() => {
    if (!hydrated || Platform.OS === "web") return;

    try {
      // From packages/shared_mono_app/features -> up to repo root, then into apps/mobile
      const config = require("../../../apps/mobile/.env.config.json");
      const env = config.environment as Environment;

      if (env !== "sandbox" && env !== "production") {
        if (__DEV__) console.warn(`[Env Sync] Invalid: ${env}`);
        return;
      }

      if (env !== currentEnv) {
        setEnvironment(env);
      } else {
      }
    } catch {}
  }, [hydrated, currentEnv, setEnvironment]);
}

export function useEnvironmentSyncStatus() {
  const hydrated = useGlobalStore(selectors.hydrated);
  const environment = useGlobalStore(selectors.environment);
  const isMobile = Platform.OS !== "web";

  return {
    hydrated,
    environment,
    isMobile,
    shouldSync: hydrated && isMobile,
  };
}
