import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WorkspaceContentBounds = {
  left: number;
  width: number;
};

type WorkspaceContentBoundsContextValue = {
  bounds: WorkspaceContentBounds;
  setBounds: (bounds: WorkspaceContentBounds) => void;
};

const WorkspaceContentBoundsContext =
  createContext<WorkspaceContentBoundsContextValue | null>(null);

export function WorkspaceContentBoundsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [bounds, setBounds] = useState<WorkspaceContentBounds>({
    left: 0,
    width: 0,
  });
  const value = useMemo(() => ({ bounds, setBounds }), [bounds]);

  return (
    <WorkspaceContentBoundsContext.Provider value={value}>
      {children}
    </WorkspaceContentBoundsContext.Provider>
  );
}

export function useWorkspaceContentBounds() {
  return useContext(WorkspaceContentBoundsContext);
}

export function useSetWorkspaceContentBounds() {
  const ctx = useContext(WorkspaceContentBoundsContext);
  return useCallback(
    (next: WorkspaceContentBounds) => {
      if (!ctx) return;
      const { left, width } = ctx.bounds;
      if (
        Math.abs(left - next.left) < 0.5 &&
        Math.abs(width - next.width) < 0.5
      )
        return;
      ctx.setBounds(next);
    },
    [ctx],
  );
}
