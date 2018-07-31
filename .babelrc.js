module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  env: {
    development: {
      plugins: [],
    },
  },
  plugins: [
    ['@babel/plugin-proposal-class-properties'],
  ],
}
