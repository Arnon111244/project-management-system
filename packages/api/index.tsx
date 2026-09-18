"use client";
import React, { useEffect, useState, type PropsWithChildren } from "react";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { getApiUrl } from "./lib/config";
import { apiFetch } from "./lib/apiFetch";

export function ApiProvider({ children }: PropsWithChildren) {
  const [client] = useState(() => new QueryClient());
  useEffect(() => {
    setupReactQueryFocusTracking();
  }, []);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export { apiFetch } from "./lib/apiFetch";
export { useIp } from "./hooks/useIp";
export { useApiUrl, useEnvironment } from "./hooks/useEnvironment";
export { IpService } from "./services/ip";
export { getApiUrl, API_ENDPOINTS, type Environment } from "./lib/config";
export {
  PmsProjectsService,
  setPmsMockScenario,
  type PmsProjectRecord,
  type CreatePmsProjectInput,
  type PmsMockScenario,
} from "./services/pms";
export {
  usePmsProjects,
  usePmsProject,
  useCreatePmsProject,
} from "./hooks/usePms";

export function buildApiUrl(
  endpointPath: string,
  environment?: import("./lib/config").Environment,
): string {
  const base = getApiUrl(environment);
  const baseClean = base.replace(/\/$/, "");
  const pathClean = String(endpointPath).replace(/^\//, "");
  return `${baseClean}/${pathClean}`;
}

export function createEndpointCaller<
  E extends Record<string, { path: string; method?: string }>,
>(endpoints: E) {
  return async function call<
    T = unknown,
    K extends keyof E & string = keyof E & string,
  >(
    key: K,
    init?: RequestInit & {
      environment?: import("./lib/config").Environment;
      pathParams?: Record<string, string | number>;
    },
  ): Promise<T> {
    const def = endpoints[key as string];
    if (!def) throw new Error(`Unknown endpoint: ${String(key)}`);

    const environment = init?.environment;
    const {
      environment: _env,
      pathParams = {},
      ...rest
    } = (init || {}) as RequestInit & {
      environment?: import("./lib/config").Environment;
      pathParams?: Record<string, string | number>;
    };

    const resolvedPath = def.path.replace(/:([A-Za-z0-9_]+)/g, (_m, k) =>
      encodeURIComponent(String(pathParams[k] ?? "")),
    );

    const url = buildApiUrl(resolvedPath, environment);
    const method = (
      (rest?.method as string | undefined) ||
      def.method ||
      "GET"
    ).toUpperCase();

    const headers = new Headers(rest?.headers);
    const rawBody = rest?.body as
      | BodyInit
      | Record<string, unknown>
      | null
      | undefined;
    const isJsonLike =
      rawBody &&
      typeof rawBody === "object" &&
      (typeof FormData === "undefined" || !(rawBody instanceof FormData)) &&
      (typeof Blob === "undefined" || !(rawBody instanceof Blob));
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const opts = {
      ...(rest || {}),
      method,
      headers,
      body: isJsonLike
        ? JSON.stringify(rawBody)
        : (rawBody as BodyInit | null | undefined),
    } as RequestInit;

    return apiFetch<T>(url, opts);
  };
}

export function setupReactQueryFocusTracking() {
  if (typeof window === "undefined") return;
  try {
    const { AppState, Platform } = require("react-native");
    if (Platform?.OS && Platform.OS !== "web") {
      focusManager.setEventListener((handleFocus) => {
        const sub = AppState.addEventListener("change", (state: string) => {
          handleFocus(state === "active");
        });
        return () => sub.remove();
      });
      return;
    }
  } catch {}
  const onFocus = () => focusManager.setFocused(true);
  const onBlur = () => focusManager.setFocused(false);
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      focusManager.setFocused(!document.hidden);
    });
  }
}
