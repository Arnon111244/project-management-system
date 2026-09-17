// router/index.web.ts
"use client";

import React from "react";
import NextLink from "next/link";
import { useRouter as useNextRouter } from "next/navigation";
type RouterLike = {
  push: (path: string, params?: any) => void;
  replace?: (path: string, params?: any) => void;
  getParam: (key: string) => string | undefined;
};
let _navigate: ((path: string) => void) | null = null;

export function primeWebNavigate(router: any) {
  _navigate = (href: string) => router.push(href);
}

// router/index.web.ts
export function navigate(path: string, params?: any) {
  const url = params
    ? `${path}?${new URLSearchParams(params).toString()}`
    : path;

  if (_navigate) {
    _navigate(url);
  } else if (typeof window !== "undefined") {
    window.location.href = url;
  }
}

export function useRouter(): RouterLike {
  const router = useNextRouter();

  return {
    push: (path: string, params?: any) => {
      const url = params
        ? `${path}?${new URLSearchParams(params).toString()}`
        : path;

      router.push(url);
    },

    replace: (path: string, params?: any) => {
      const url = params
        ? `${path}?${new URLSearchParams(params).toString()}`
        : path;

      router.replace(url);
    },

    getParam: (key: string) => {
      const url = new URL(window.location.href);
      return url.searchParams.get(key) || undefined;
    },
  };
}

export function useNavigate() {
  const router = useNextRouter();
  return React.useCallback((p: string) => router.push(p), [router]);
}

export const Link: typeof NextLink = NextLink;
