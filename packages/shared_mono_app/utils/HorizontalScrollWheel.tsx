import React, { memo, useEffect, useRef } from "react";
import { Platform, ScrollView, type ScrollViewProps } from "react-native";

type Props = ScrollViewProps;

type MaybeWebScrollView = ScrollView & {
  getScrollableNode?: () => HTMLElement;
};

export function HorizontalScrollOnWheel({
  children,
  contentContainerStyle,
  ...rest
}: Props) {
  const scrollRef = useRef<ScrollView | null>(null);
  const animRef = useRef<number | null>(null);
  const velocityRef = useRef(0);

  const MULTIPLIER = 0.1;
  const FRICTION = 0.93;
  const MIN_VELOCITY = 0.3;

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const getEl = (): HTMLElement | null => {
      const cur = scrollRef.current as MaybeWebScrollView | null;
      if (!cur) return null;
      if (typeof cur.getScrollableNode === "function") {
        return cur.getScrollableNode() ?? null;
      }
      return (cur as unknown as HTMLElement) ?? null;
    };

    const el = getEl();
    if (!el) return;

    (el.style as CSSStyleDeclaration).overscrollBehavior = "contain";

    const step = () => {
      const elNow = getEl();
      if (!elNow) return;

      if (Math.abs(velocityRef.current) > MIN_VELOCITY) {
        elNow.scrollLeft += velocityRef.current;
        velocityRef.current *= FRICTION;
        animRef.current = requestAnimationFrame(step);
      } else {
        velocityRef.current = 0;
        if (animRef.current) {
          cancelAnimationFrame(animRef.current);
          animRef.current = null;
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      const isTouchpadHorizontal =
        Math.abs(e.deltaX) > 0 && Math.abs(e.deltaX) >= Math.abs(e.deltaY);
      if (isTouchpadHorizontal) return;
      if (Math.abs(e.deltaY) === 0) return;

      e.preventDefault();

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      if (e.deltaMode === 2) delta *= 800;

      velocityRef.current += delta * MULTIPLIER;

      if (!animRef.current) animRef.current = requestAnimationFrame(step);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, []);

  return (
    <ScrollView
      {...rest}
      ref={scrollRef}
      horizontal
      contentContainerStyle={[
        contentContainerStyle,
        { direction: "ltr" } as const,
      ]}
    >
      {children}
    </ScrollView>
  );
}

export const ScrollWheel = memo(HorizontalScrollOnWheel);
HorizontalScrollOnWheel.displayName = "HorizontalScrollOnWheel";
