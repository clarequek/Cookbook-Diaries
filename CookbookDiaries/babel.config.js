module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel", "react-native-reanimated/plugin"], 
  };
};

//everytime you make a change to babel, need to ctrl c the logs and restart (npx expo start) again 
//if it says cannot connect to metro, means need to reload the app once again  