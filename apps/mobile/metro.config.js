const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, "../../packages/shared");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [sharedRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
];

config.resolver.extraNodeModules = {
  "@hedhunter/shared": sharedRoot,
};

module.exports = withNativeWind(config, { input: "./src/globals.css" });
