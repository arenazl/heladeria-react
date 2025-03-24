const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  
  const { transformer, resolver } = config;

  // Add additional file extensions
  config.resolver = {
    ...resolver,
    sourceExts: [...resolver.sourceExts, 'ts', 'tsx'],
    assetExts: [...resolver.assetExts, 'ttf'],
  };

  return config;
})();
