// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
// const exclusionList = require("metro-config/src/defaults/exclusionList");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// Use Expo defaults
// const config = getDefaultConfig(projectRoot);

// config.resolver.blockList = [
//   /.*\/dist\/.*/,
//   /node_modules\/.*\/dist\/.*/,
//   /.*\.js\.map$/,
// ];
const config = getDefaultConfig(projectRoot);

// Block compiled monorepo package output — never block node_modules/*/dist (NativeWind css-interop).
const workspaceRootPosix = workspaceRoot.replace(/\\/g, "/");
config.resolver.blockList = [
  new RegExp(`${workspaceRootPosix}/packages/[^/]+/dist/.*`),
  new RegExp(`${workspaceRootPosix}/apps/[^/]+/dist/.*`),
  /.*\.js\.map$/,
];

// Augment watchFolders to include the monorepo root while keeping Expo defaults
config.watchFolders = Array.from(
  new Set([...(config.watchFolders || []), workspaceRoot]),
);

// Resolve hoisted workspace packages (e.g. expo-video imported from packages/shared_mono_app)
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Resolve modules from the workspace root first
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) =>
      typeof name === "string"
        ? path.join(workspaceRoot, "node_modules", name)
        : undefined,
  },
);

// Enable react-native-svg-transformer
const { resolver: defaultResolver, transformer: defaultTransformer } = config;
config.transformer = {
  ...(defaultTransformer || {}),
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  inlineRequires: true,
};

config.resolver.assetExts = (defaultResolver?.assetExts || []).filter(
  (ext) => ext !== "svg",
);
config.resolver.sourceExts = Array.from(
  new Set([...(defaultResolver?.sourceExts || []), "svg"]),
);

config.resolver.unstable_enableSymlinks = true;

module.exports = withNativeWind(config, {
  input: "./global.css",
});
