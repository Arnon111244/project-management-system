/**
 * Environment Management Hook
 * Provides utilities for switching and syncing environment state
 * Works on both web and mobile with proper AsyncStorage/localStorage sync
 */

import { useCallback } from "react";
import { useGlobalStore, selectors } from "state";
import type { Environment } from "state/slices/environment";

export function useEnvironment() {
  const environment = useGlobalStore(selectors.environment);
  const setEnvironment = useGlobalStore((state) => state.setEnvironment);

  /**
   * Switch environment
   * Automatically syncs to AsyncStorage/localStorage via Zustand persist middleware
   */
  const switchEnvironment = useCallback(
    (newEnv: Environment) => {
      setEnvironment(newEnv);
    },
    [environment, setEnvironment],
  );

  /**
   * Toggle between sandbox and production
   */
  const toggleEnvironment = useCallback(() => {
    const newEnv: Environment =
      environment === "sandbox" ? "production" : "sandbox";
    switchEnvironment(newEnv);
  }, [environment, switchEnvironment]);

  return {
    environment,
    switchEnvironment,
    toggleEnvironment,
    isSandbox: environment === "sandbox",
    isProduction: environment === "production",
  };
}
