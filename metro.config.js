/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  // resolver: {
  //   sourceExts: ['jsx', 'js', 'ts', 'tsx'], // add this line
  // },
  // server: {
  //   port: 8082, // change this to a different port
  // },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
