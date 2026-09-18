import { useQuery } from "@tanstack/react-query";
import { PmsProjectsService } from "../services/pms";

// PMS demo hooks over the mock service (PM-002). Retry is disabled so the error
// state convention (screen-specification §2.2) surfaces immediately in the demo.

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
