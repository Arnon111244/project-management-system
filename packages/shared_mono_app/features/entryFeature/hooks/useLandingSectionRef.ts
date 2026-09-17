import { useCallback } from "react";
import type { View } from "react-native";

import { registerLandingSectionRef } from "../utils/landingScrollRegistry";

export function useLandingSectionRef(sectionId: string | undefined) {
  return useCallback(
    (node: View | null) => {
      if (!sectionId) return;
      registerLandingSectionRef(sectionId, node);
    },
    [sectionId],
  );
}
