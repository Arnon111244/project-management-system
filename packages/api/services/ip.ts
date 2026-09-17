import { apiFetch } from "../lib/apiFetch";

export type IpResponse = { ip: string };

export const IpService = {
  getIp(): Promise<IpResponse> {
    return apiFetch("https://api.ipify.org?format=json");
  },
};
