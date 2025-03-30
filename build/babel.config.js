webpack
module.exports = {
  presets: [
    'react-app',
    '@babel/preset-flow'
  ],
  plugins: [
    '@babel/plugin-syntax-flow'
  ]
};


ignore: [
  "**/node_modules/@react-native/**"
]
