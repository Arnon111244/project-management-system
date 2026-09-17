export type AnimationVariant =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scale"
  | "fade";

export const ENTRY_ANIM = {
  duration: 700,
  distance: 36,
  spring: { tension: 55, friction: 10 },
} as const;

export function getInitialOffset(variant: AnimationVariant): {
  x: number;
  y: number;
  scale: number;
} {
  switch (variant) {
    case "fadeDown":
      return { x: 0, y: -ENTRY_ANIM.distance, scale: 1 };
    case "fadeLeft":
      return { x: -ENTRY_ANIM.distance, y: 0, scale: 1 };
    case "fadeRight":
      return { x: ENTRY_ANIM.distance, y: 0, scale: 1 };
    case "scale":
      return { x: 0, y: 0, scale: 0.92 };
    case "fade":
      return { x: 0, y: 0, scale: 1 };
    default:
      return { x: 0, y: ENTRY_ANIM.distance, scale: 1 };
  }
}

export const cardHoverClass =
  "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10";
