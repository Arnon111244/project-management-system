import { useRef, useEffect, useCallback } from "react";

/**
 * Hook that returns a throttled version of a given function with a fixed delay (300ms)
 * and correctly handles updated values inside the callback.
 */
export function useThrottle<T extends (...args: any[]) => void>(callback: T) {
  const callbackRef = useRef(callback);
  const lastExecutedRef = useRef(0);
  const timeoutRef = useRef<number | NodeJS.Timeout | null>(null);
  const throttledRef = useRef<((...args: Parameters<T>) => void) | null>(null);

  // Update the ref each time the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create custom throttle function
  if (!throttledRef.current) {
    throttledRef.current = (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutedRef.current;

      // If more than 300ms have passed since last execution, execute immediately
      if (timeSinceLastExecution >= 300) {
        lastExecutedRef.current = now;
        callbackRef.current(...args);
      } else {
        // If not enough time has passed, cancel any previous timeout and set a new one
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastExecutedRef.current = Date.now();
          callbackRef.current(...args);
          timeoutRef.current = null;
        }, 300 - timeSinceLastExecution);
      }
    };
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Return the same throttled function always
  return useCallback((...args: Parameters<T>) => {
    if (throttledRef.current) {
      throttledRef.current(...args);
    }
  }, []);
}
