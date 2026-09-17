import { useCallback, useState } from "react";
import { Platform } from "react-native";

export function useAnchorRect(triggerRef: any) {
  const [anchor, setAnchor] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const updateAnchorRect = useCallback(() => {
    if (Platform.OS !== "web") return;

    try {
      const el = triggerRef.current;
      const rect = el?.getBoundingClientRect?.();
      if (rect) {
        setAnchor({
          left: rect.left + (window?.scrollX ?? 0),
          top: rect.top + rect.height + (window?.scrollY ?? 0),
          width: rect.width,
          height: rect.height,
        });
      }
    } catch {}
  }, [triggerRef]);

  return { anchor, updateAnchorRect, setAnchor };
}
