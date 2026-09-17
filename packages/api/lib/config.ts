// Environment configuration for API endpoints.
// Demo login works offline — configure these when connecting a real backend.
export const API_ENDPOINTS = {
  sandbox:
    process.env.NEXT_PUBLIC_API_SANDBOX_URL ??
    process.env.EXPO_PUBLIC_API_SANDBOX_URL ??
    "https://api.example.com/sandbox",
  production:
    process.env.NEXT_PUBLIC_API_PRODUCTION_URL ??
    process.env.EXPO_PUBLIC_API_PRODUCTION_URL ??
    "https://api.example.com",
} as const;

export type Environment = keyof typeof API_ENDPOINTS;

/**
 * Get the API URL for the given environment.
 * In web development, uses Next.js proxy to avoid CORS issues.
 * In native/production, uses direct API URLs.
 */
export function getApiUrl(environment: Environment = "sandbox"): string {
  const isBrowser = typeof window !== "undefined";

  const isNative =
    typeof navigator !== "undefined" && navigator.product === "ReactNative";

  if (isBrowser && !isNative && process.env.NODE_ENV === "development") {
    return "/api-proxy";
  }

  return API_ENDPOINTS[environment];
}
