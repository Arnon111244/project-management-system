import { useCallback, useRef, useEffect, useState } from "react";
import { Platform } from "react-native";

export function useAnchorPosition(open: boolean, triggerRef: any) {
  const [anchor, setAnchor] = useState<any>(null);
  const [, setWindowTick] = useState(0);
  const resizeTimeout = useRef<number | null>(null);

  const updateAnchorRect = useCallback(() => {
    if (Platform.OS !== "web") return;
    try {
      const el: any = triggerRef.current;
      const rect = el?.getBoundingClientRect?.();
      if (rect) {
        setAnchor({
          left: rect.left + (window?.scrollX ?? 0),
          top: rect.top + rect.height + (window?.scrollY ?? 0),
          width: rect.width,
          height: rect.height,
        });
        setWindowTick((t) => t + 1);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handler = () => {
      if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current);
      resizeTimeout.current = window.setTimeout(() => {
        updateAnchorRect();
        resizeTimeout.current = null;
      }, 70) as unknown as number;
    };

    if (open) {
      updateAnchorRect();
      window.addEventListener("resize", handler);
      window.addEventListener("scroll", handler, true);
    }

    return () => {
      if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current);
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [open, updateAnchorRect]);

  return { anchor, updateAnchorRect };
}
