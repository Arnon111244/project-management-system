import { useGlobalStore } from "state";
import { getApiUrl } from "../lib/config";

/**
 * Hook to get the current API base URL based on the selected environment
 * @returns The API base URL for the current environment
 */
export function useApiUrl(): string {
  const environment = useGlobalStore((state) => state.environment);
  return getApiUrl(environment);
}

/**
 * Hook to get the current environment and a function to switch between environments
 */
export function useEnvironment() {
  const environment = useGlobalStore((state) => state.environment);
  const setEnvironment = useGlobalStore((state) => state.setEnvironment);

  const toggleEnvironment = () => {
    setEnvironment(environment === "sandbox" ? "production" : "sandbox");
  };

  return {
    environment,
    setEnvironment,
    toggleEnvironment,
    isSandbox: environment === "sandbox",
    isProduction: environment === "production",
  };
}
