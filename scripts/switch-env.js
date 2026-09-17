#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const command = args[0];

const webEnvPath = path.join(__dirname, "../apps/web/.env.local");
const sandboxEnvPath = path.join(__dirname, "../apps/web/.env.sandbox");
const prodEnvPath = path.join(__dirname, "../apps/web/.env.production");
const mobileConfigPath = path.join(
  __dirname,
  "../apps/mobile/.env.config.json",
);

function switchEnvironment(env) {
  const sourcePath = env === "sandbox" ? sandboxEnvPath : prodEnvPath;

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Environment file not found: ${sourcePath}`);
    process.exit(1);
  }

  try {
    // Update web environment
    const content = fs.readFileSync(sourcePath, "utf8");
    fs.writeFileSync(webEnvPath, content, "utf8");
    console.log(`✅ Switched to ${env.toUpperCase()} environment`);
    console.log(`📝 Updated: apps/web/.env.local`);

    // Update mobile environment config
    updateMobileEnvironment(env);
  } catch (error) {
    console.error(`❌ Failed to switch environment:`, error.message);
    process.exit(1);
  }
}

function updateMobileEnvironment(env) {
  try {
    // Create mobile config that will be read on app startup
    const mobileConfig = {
      environment: env,
      updatedAt: new Date().toISOString(),
      updatedBy: "switch-env-script",
    };

    fs.writeFileSync(
      mobileConfigPath,
      JSON.stringify(mobileConfig, null, 2),
      "utf8",
    );
    console.log(`📱 Updated: apps/mobile/.env.config.json`);
    console.log(
      `ℹ️  Mobile app will use ${env.toUpperCase()} environment on next launch`,
    );
  } catch (error) {
    console.warn(`⚠️  Could not update mobile config:`, error.message);
    console.log(
      `💡 Mobile app will continue using its current environment from AsyncStorage`,
    );
  }
}

function checkEnvironment() {
  console.log("\n🌐 Web Environment:");
  console.log("─────────────────────");

  if (!fs.existsSync(webEnvPath)) {
    console.log("⚠️  No environment configured (.env.local not found)");
    console.log('Run "yarn sand" or "yarn prod" to set an environment');
  } else {
    try {
      const content = fs.readFileSync(webEnvPath, "utf8");
      const envMatch = content.match(/NEXT_PUBLIC_API_ENVIRONMENT=(\w+)/);
      const nodeEnvMatch = content.match(/NODE_ENV=(\w+)/);

      if (envMatch) {
        console.log(`📍 API Environment: ${envMatch[1].toUpperCase()}`);
      }
      if (nodeEnvMatch) {
        console.log(`📍 Node Environment: ${nodeEnvMatch[1]}`);
      }

      if (!envMatch && !nodeEnvMatch) {
        console.log("⚠️  Environment variables not found in .env.local");
      }
    } catch (error) {
      console.error(`❌ Failed to read web environment:`, error.message);
    }
  }

  console.log("\n📱 Mobile Environment:");
  console.log("─────────────────────");

  if (!fs.existsSync(mobileConfigPath)) {
    console.log("⚠️  No mobile config found (.env.config.json not found)");
    console.log("💡 Mobile app uses default: SANDBOX");
    console.log('Run "yarn sand" or "yarn prod" to set an environment');
  } else {
    try {
      const mobileConfig = JSON.parse(
        fs.readFileSync(mobileConfigPath, "utf8"),
      );
      console.log(
        `📍 API Environment: ${mobileConfig.environment.toUpperCase()}`,
      );
      console.log(
        `📅 Last updated: ${new Date(mobileConfig.updatedAt).toLocaleString()}`,
      );
      console.log(`ℹ️  This sets the default on app launch`);
    } catch (error) {
      console.error(`❌ Failed to read mobile config:`, error.message);
    }
  }

  console.log(
    "\n💡 Note: Mobile app persists environment in AsyncStorage after first launch",
  );
  console.log(
    "   Users can toggle environment in-app, which overrides this config.\n",
  );
}

switch (command) {
  case "sandbox":
    switchEnvironment("sandbox");
    break;
  case "production":
    switchEnvironment("production");
    break;
  case "check":
    checkEnvironment();
    break;
  default:
    console.log("Usage:");
    console.log("  yarn sand     - Switch to sandbox environment");
    console.log("  yarn prod     - Switch to production environment");
    console.log("  yarn env      - Check current environment");
    process.exit(1);
}
