/** @type {import('next').NextConfig} */

const { withExpo } = require("@expo/next-adapter");

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "monorepo";

module.exports = withExpo({
  reactStrictMode: false,
  ...(isGitHubPages
    ? {
        output: "export",
        trailingSlash: true,
        ...(repoBasePath
          ? { basePath: repoBasePath, assetPrefix: repoBasePath }
          : {}),
      }
    : {}),

  compiler: {
    // Remove console.log in production builds
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"], // Keep error and warn
          }
        : false,
  },

  images: {
    unoptimized: isGitHubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },

  experimental: {
    reactCompiler: true,
  },

  transpilePackages: [
    "react-native",
    "react-native-web",
    "ui",
    "nativewind",
    "react-native-css-interop",
    "api",
    "state",
    "shared_mono_app",
    "expo",
    "expo-modules-core",
    "expo-router",
    "expo-constants",
    "react-native-gesture-handler",
    "react-native-reanimated",
    "react-native-safe-area-context",
  ],

  webpack: (config, { dev }) => {
    if (!dev) {
      const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
      config.plugins = config.plugins || [];
      config.plugins.push(new CaseSensitivePathsPlugin());
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
      "react-native-svg": "react-native-svg-web",
      "react-native/Libraries/Image/AssetRegistry":
        "react-native-web/dist/cjs/modules/AssetRegistry",
    };

    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];

    // Handle SVGs:
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.svg$/i,
      oneOf: [
        {
          resourceQuery: /url/,
          type: "asset/resource",
        },
        {
          issuer: /\.[jt]sx?$/,
          use: [
            {
              loader: require.resolve("@svgr/webpack"),
              options: {
                native: true,
                svgo: true,
                svgoConfig: {
                  plugins: [
                    { name: "removeViewBox", active: false },
                    { name: "convertColors", params: { currentColor: true } },
                  ],
                },
              },
            },
          ],
        },
      ],
    });

    config.watchOptions = {
      ignored: [
        "**/.git/**",
        "**/node_modules/**",
        "**/.next/**",
        "**/build/**",
        "**/dist/**",
      ],
    };

    if (process.env.NODE_ENV !== "production") {
      config.output = config.output || {};
      config.output.chunkLoadTimeout = 300000;
    }
    return config;
  },
});
