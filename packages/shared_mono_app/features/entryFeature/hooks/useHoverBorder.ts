import { useState } from "react";

import { NEURAL } from "ui/theme/neuralRuntime";

type UseHoverBorderOptions = {
  accent?: string;
  base?: string;
};

export function useHoverBorder({
  accent = NEURAL.borderGlow,
  base = NEURAL.border,
}: UseHoverBorderOptions = {}) {
  const [hovered, setHovered] = useState(false);

  return {
    hovered,
    borderColor: hovered ? accent : base,
    hoverHandlers: {
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
    },
  };
}
