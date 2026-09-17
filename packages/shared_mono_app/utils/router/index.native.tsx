import { useRouter as expoUseRouter, useLocalSearchParams } from "expo-router";
import { Link as ExpoLink } from "expo-router";

export function useRouter() {
  const r: any = expoUseRouter();
  const params = useLocalSearchParams();

  return {
    push: (path: string, params?: any) => {
      if (typeof r.push === "function") {
        return r.push({
          pathname: path,
          params,
        });
      }

      if (typeof r.replace === "function") {
        return r.replace({
          pathname: path,
          params,
        });
      }

      if (r.router && typeof r.router.push === "function") {
        return r.router.push({
          pathname: path,
          params,
        });
      }

      console.warn("expo-router: push not available", r);
    },

    replace: (path: string) => {
      if (typeof r.replace === "function") return r.replace(path);

      if (r.router && typeof r.router.replace === "function") {
        return r.router.replace(path);
      }

      console.warn("expo-router: replace not available", r);
    },

    params,

    getParam: (key: string) => {
      const value = params?.[key];
      return Array.isArray(value) ? value[0] : value;
    },
  } as const;
}

export const Link = ExpoLink;

// Imperative navigate that doesn't rely on hooks or mounted router context.
export async function navigate(path: string, params?: any) {
  try {
    const mod: any = await import("expo-router");

    if (typeof mod.push === "function") {
      return mod.push({
        pathname: path,
        params,
      });
    }

    if (mod.router && typeof mod.router.push === "function") {
      return mod.router.push(path, params);
    }

    if (mod.default && typeof mod.default.push === "function") {
      return mod.default.push(path, params);
    }

    console.warn("expo-router.navigate: push not available", mod);
  } catch (e) {
    console.warn("expo-router.navigate failed", e);
  }
}
