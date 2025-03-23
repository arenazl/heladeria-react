const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve('react-native-web/babel'),
    },
    resolver: {
      sourceExts: [...sourceExts, 'ts', 'tsx'],
      assetExts: [...assetExts, 'ttf'],
    },
  };
})();
