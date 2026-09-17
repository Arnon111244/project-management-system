/**
 * Application Logger
 * Lightweight logger used during development.
 */

const isDevelopment =
  process.env.NODE_ENV === "development" ||
  (typeof __DEV__ !== "undefined" && __DEV__);

const noop = () => {};

/**
 * Create logger functions
 */
function createLogger(feature: string) {
  if (!isDevelopment) {
    // Return no-op functions that will be tree-shaken in production
    return {
      debug: noop,
      info: noop,
      warn: noop,
      error: noop,
    };
  }

  // Only create real loggers in development
  return {
    debug: (msg: string, ...args: any[]) => {
      console.log(`[${feature.toUpperCase()}]`, msg, ...args);
    },
    info: (msg: string, ...args: any[]) => {
      console.info(`[${feature.toUpperCase()}]`, msg, ...args);
    },
    warn: (msg: string, ...args: any[]) => {
      console.warn(`[${feature.toUpperCase()}]`, msg, ...args);
    },
    error: (msg: string, ...args: any[]) => {
      console.error(`[${feature.toUpperCase()}]`, msg, ...args);
    },
  };
}

/**
 * Logger instance
 * Usage:
 *   logger.auth.debug("User authenticated");
 */
export const logger = {
  auth: createLogger("AUTH"),
  api: createLogger("API"),
  navigation: createLogger("NAVIGATION"),
  state: createLogger("STATE"),
} as const;
