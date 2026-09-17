export * from "./router/index.native";
export * from "./router/index.native";
import { useRouter as expoUseRouter, Link as ExpoLink } from "expo-router";
import React from "react";

export type RouterLike = {
  push: (path: string, params?: any) => void;
};

export function useRouter(): RouterLike {
  const r = expoUseRouter();

  return {
    push: (p: string, params?: any) => {
      if (params) {
        r.push({
          pathname: p,
          params,
        });
      } else {
        r.push(p);
      }
    },
  };
}

export function navigate(path: string, params?: any) {
  const r = expoUseRouter();
  if (params) {
    r.push({
      pathname: path,
      params,
    });
  } else {
    r.push(path);
  }
}

export const Link: typeof ExpoLink = ExpoLink;

export default {
  useRouter,
  navigate,
  Link,
};
