import { useQuery } from "@tanstack/react-query";
import { IpService } from "../services/ip";

export function useIp() {
  return useQuery({
    queryKey: ["ip"],
    queryFn: () => IpService.getIp(),
    staleTime: 60_000, // 1 minute
    refetchOnWindowFocus: true,
  });
}
