import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PmsProjectsService,
  type CreatePmsProjectInput,
} from "../services/pms";

// PMS demo hooks over the mock service (PM-002; create extended by PM-003). Retry is
// disabled so the error state convention (screen-specification §2.2) surfaces
// immediately in the demo.

export function usePmsProjects() {
  return useQuery({
    queryKey: ["pms", "projects"],
    queryFn: () => PmsProjectsService.listProjects(),
    retry: false,
  });
}

export function usePmsProject(projectId: string) {
  return useQuery({
    queryKey: ["pms", "projects", projectId],
    queryFn: () => PmsProjectsService.getProject(projectId),
    enabled: Boolean(projectId),
    retry: false,
  });
}

/**
 * Provisional create flow (PM-003): writes to the in-memory mock store, then keeps
 * the query cache in sync — the list (SCR-02) is invalidated and the new record is
 * seeded into its detail query so SCR-03/SCR-04 render without a fetch gap.
 */
export function useCreatePmsProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePmsProjectInput) =>
      PmsProjectsService.createProject(input),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["pms", "projects"] });
      queryClient.setQueryData(["pms", "projects", created.projectId], created);
    },
  });
}
