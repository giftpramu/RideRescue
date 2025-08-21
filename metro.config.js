const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper platform resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Handle the web compatibility for react-native-maps
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
