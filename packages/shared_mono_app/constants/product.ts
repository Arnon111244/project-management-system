/** Shared product URLs for Neural Workspace */
export const LIVE_DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL ??
  process.env.EXPO_PUBLIC_DEMO_URL ??
  "https://react-native-next-theme-web.vercel.app";

/** Premium live demo (full feature preview). */
export const PREMIUM_DEMO_URL = LIVE_DEMO_URL;

/** Premium product page — ThemeWagon-compliant backlink (store, not checkout). */
export const PREMIUM_PRODUCT_PAGE_URL =
  process.env.NEXT_PUBLIC_PREMIUM_PRODUCT_URL ??
  "https://neural-workspace.lemonsqueezy.com/";

/** Demo APK served from the web app's public folder. */
export const DEMO_APK_FILE = "#!";
export const DEMO_APK_PATH = `/${DEMO_APK_FILE}`;

/** Free ThemeWagon source bundle — local public file or external URL. */
export const FREE_SOURCE_ZIP_FILE = "React-Native-Next-Theme.zip";
export const FREE_SOURCE_ZIP_PATH = `/${FREE_SOURCE_ZIP_FILE}`;
export const FREE_SOURCE_ZIP_URL = process.env.NEXT_PUBLIC_FREE_SOURCE_ZIP_URL;

export function getDemoApkUrl(origin?: string): string {
  if (origin) {
    return `${origin.replace(/\/$/, "")}${DEMO_APK_PATH}`;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${DEMO_APK_PATH}`;
  }

  return `${LIVE_DEMO_URL.replace(/\/$/, "")}${DEMO_APK_PATH}`;
}

export function getFreeSourceZipUrl(origin?: string): string {
  if (FREE_SOURCE_ZIP_URL) {
    return FREE_SOURCE_ZIP_URL;
  }

  if (origin) {
    return `${origin.replace(/\/$/, "")}${FREE_SOURCE_ZIP_PATH}`;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${FREE_SOURCE_ZIP_PATH}`;
  }

  return `${LIVE_DEMO_URL.replace(/\/$/, "")}${FREE_SOURCE_ZIP_PATH}`;
}

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "abdallaharef65@gmail.com";

export const AUTHOR_NAME = "Aref Abdallah";
export const AUTHOR_LINKEDIN_URL =
  "https://www.linkedin.com/in/aref-abdallah-4a4b11210/";

export const THEMEWAGON_URL = "https://themewagon.com";
