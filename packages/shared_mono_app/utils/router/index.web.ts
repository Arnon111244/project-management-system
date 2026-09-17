"use client";
import NextLink from "next/link";
import { useRouter as useNextRouter } from "next/navigation";

export type RouterLike = {
  push: (path: string, params?: any) => void;
  replace?: (path: string, params?: any) => void;
  getParam: (key: string) => string | undefined;
};

let _navigate: ((path: string) => void) | null = null;

export function primeWebNavigate(router: any) {
  _navigate = (href: string) => router.push(href);
}

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
  const buildUrl = (path: string, params?: any) =>
    params ? `${path}?${new URLSearchParams(params).toString()}` : path;

  return {
    push: (path: string, params?: any) => router.push(buildUrl(path, params)),
    replace: (path: string, params?: any) =>
      router.replace(buildUrl(path, params)),
    getParam: (key: string) => {
      if (typeof window === "undefined") return undefined;
      return new URL(window.location.href).searchParams.get(key) || undefined;
    },
  };
}

export const Link = NextLink;
