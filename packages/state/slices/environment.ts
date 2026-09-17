export type Environment = "sandbox" | "production";

export function getInitialEnvironment(): Environment {
  const env = process.env.NEXT_PUBLIC_API_ENVIRONMENT;
  if (env === "production" || env === "sandbox") {
    return env;
  }

  const isReactNative =
    typeof navigator !== "undefined" &&
    (navigator as { product?: string }).product === "ReactNative";
  if (isReactNative) return "sandbox";

  return "production";
}

export type EnvironmentSlice = {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
};

export const createEnvironmentSlice = (): EnvironmentSlice => ({
  environment: getInitialEnvironment(),
  setEnvironment: () => {
    console.warn("setEnvironment called outside of the store");
  },
});
