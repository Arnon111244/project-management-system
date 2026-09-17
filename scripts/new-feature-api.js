#!/usr/bin/env node
/*
Usage:
  node scripts/new-feature-api.js packages/shared_mono_app/features/login

Creates:
  <feature>/api/endpoints.js  (per-feature endpoint config: path, auth, method)
  <feature>/api/index.ts      (uses createEndpointCaller from 'api')
*/
const fs = require("fs");
const path = require("path");

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function main() {
  const argRaw = process.argv.slice(2).join(" ").trim();
  if (!argRaw) {
    console.error("Provide a feature folder path.");
    console.error("Examples:");
    console.error("  node scripts/new-feature-api.js otp");
    console.error(
      "  node scripts/new-feature-api.js packages/shared_mono_app/features/login",
    );
    process.exit(1);
  }
  function resolveFeaturePath(input) {
    if (path.isAbsolute(input)) return input;
    const looksLikePath =
      input.includes("/") ||
      input.includes("\\") ||
      input.startsWith("packages/") ||
      input.startsWith("./") ||
      input.startsWith("../");
    if (looksLikePath) return path.resolve(process.cwd(), input);
    // Treat as a short feature name under shared_mono_app/features
    const normalized = input.toLowerCase();
    return path.join(
      process.cwd(),
      "packages",
      "shared_mono_app",
      "features",
      normalized,
    );
  }
  const abs = resolveFeaturePath(argRaw);
  const apiDir = path.join(abs, "api");
  ensureDir(abs);
  ensureDir(apiDir);

  const endpointsFile = path.join(apiDir, "endpoints.js");
  const indexFile = path.join(apiDir, "index.ts");

  if (fs.existsSync(endpointsFile) || fs.existsSync(indexFile)) {
    console.error("Refusing to overwrite existing files:");
    if (fs.existsSync(endpointsFile)) console.error(" - " + endpointsFile);
    if (fs.existsSync(indexFile)) console.error(" - " + indexFile);
    process.exit(2);
  }

  const endpointsJs = `/**
 * Feature endpoints configuration (JS to keep it simple).
 * Each key maps to an object with:
 *  - path: string (relative API path, e.g., '/api/feature/action')
 *  - auth: boolean (whether to include the access token)
 *  - method?: string (optional default, e.g., 'GET' | 'POST')
 */
module.exports = {
  sampleEndpoint: {
    path: '/replace-this-with-api-endpoint',
    auth: true,
    method: 'GET',
  },
};
`;

  const indexTs = `import { createEndpointCaller } from 'api';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const endpoints: Record<string, { path: string; auth?: boolean; method?: string }> = require('./endpoints');

export type EndpointKey = keyof typeof endpoints & string;
export const call = createEndpointCaller(endpoints);

// Example call (ready to use)
export async function sampleEndpoint<T = unknown>(): Promise<T> {
  return call('sampleEndpoint');
}

// POST example with JSON body
export async function postMyOpportunities<T = unknown>(payload: any): Promise<T> {
  return call('sampleEndpoint', { method: 'POST', body: payload as any });
}

// PUT example with JSON body
export async function putMyOpportunities<T = unknown>(payload: any): Promise<T> {
  return call('sampleEndpoint', { method: 'PUT', body: payload as any });
}
`;

  fs.writeFileSync(endpointsFile, endpointsJs, "utf8");
  fs.writeFileSync(indexFile, indexTs, "utf8");

  console.log("Feature API created at:", apiDir);
  console.log("• endpoints.js - define endpoints here (path, auth, method)");
  console.log(
    "• index.ts      - buildUrl(key), call(key), and an example function ready to use",
  );
  console.log("Feature root:", abs);
}

main();
