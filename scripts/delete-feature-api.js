#!/usr/bin/env node
/*
Usage:
  node scripts/delete-feature-api.js packages/shared_mono_app/features/login

Deletes files created by the generator:
  <feature>/api/endpoints.js
  <feature>/api/index.ts
If the api folder becomes empty, it removes the folder as well.
Safety: Only deletes the two known files; leaves any other files intact.
*/
const fs = require("fs");
const path = require("path");

function main() {
  const argRaw = process.argv.slice(2).join(" ").trim();
  if (!argRaw) {
    console.error("Provide a feature folder path.");
    console.error("Examples:");
    console.error("  node scripts/delete-feature-api.js otp");
    console.error(
      "  node scripts/delete-feature-api.js packages/shared_mono_app/features/login",
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
  const endpointsFile = path.join(apiDir, "endpoints.js");
  const indexFile = path.join(apiDir, "index.ts");

  if (!fs.existsSync(apiDir)) {
    console.error("No api directory found at:", apiDir);
    process.exit(2);
  }

  let deleted = false;
  if (fs.existsSync(endpointsFile)) {
    fs.unlinkSync(endpointsFile);
    console.log("Deleted:", endpointsFile);
    deleted = true;
  } else {
    console.log("Not found (skipped):", endpointsFile);
  }
  if (fs.existsSync(indexFile)) {
    fs.unlinkSync(indexFile);
    console.log("Deleted:", indexFile);
    deleted = true;
  } else {
    console.log("Not found (skipped):", indexFile);
  }

  // Remove api directory if empty
  try {
    const remaining = fs.readdirSync(apiDir);
    if (remaining.length === 0) {
      fs.rmdirSync(apiDir);
      console.log("Removed empty directory:", apiDir);
    } else {
      console.log("Directory not empty, leaving as-is:", apiDir);
    }
  } catch (e) {
    console.warn(
      "Could not inspect/remove directory:",
      apiDir,
      e?.message || e,
    );
  }

  if (!deleted) {
    console.log(
      "Nothing was deleted. Ensure this feature was generated with the generator.",
    );
  }
  console.log("Feature root:", abs);
}

main();
