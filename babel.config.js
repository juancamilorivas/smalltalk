module.exports = function(api) {
    api.cache(true);
    return {
      presets: [['@babel/preset-env', {targets: {node: 'current'}}], 'babel-preset-expo'],
      "plugins": [
        ["module:react-native-dotenv", {
          "envName": "APP_ENV",
          "moduleName": "@env",
          "path": ".env",
        }],
        "react-native-reanimated/plugin",
      ]
    };
  };