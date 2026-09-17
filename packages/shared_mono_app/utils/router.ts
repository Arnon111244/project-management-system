/* eslint-disable @typescript-eslint/no-var-requires */
let impl: any;

try {
  const { Platform } = require("react-native");
  if (Platform && Platform.OS && Platform.OS !== "web") {
    impl = require("./router/index.native");
  } else {
    impl = require("./router/index.web");
  }
} catch (_err) {
  try {
    const isReactNative =
      typeof navigator !== "undefined" &&
      (navigator as any).product === "ReactNative";
    if (isReactNative) {
      impl = require("./router/index.native");
    } else {
      impl = require("./router/index.web");
    }
  } catch {
    try {
      impl = require("./router/index.native");
    } catch {
      impl = require("./router/index.web");
    }
  }
}

export const useRouter = impl.useRouter;
export const Link = impl.Link;
const rawNavigate = impl.navigate || (impl.default && impl.default.navigate);

let isNavigating = false;

export const navigate = (path: string, params?: any) => {
  if (isNavigating) return;

  isNavigating = true;
  rawNavigate?.(path, params);

  setTimeout(() => {
    isNavigating = false;
  }, 1000);
};

export const primeWebNavigate =
  impl.primeWebNavigate || (impl.default && impl.default.primeWebNavigate);

export default impl.default ?? impl;
