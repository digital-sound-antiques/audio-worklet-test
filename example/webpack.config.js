const path = require('path');

module.exports = {
  mode: "development",
  context: __dirname + "/src",
  entry: {
    "index": "./index.js",
    "processor": "./processor.js"
  },
  // devtool: "source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
    // publicPath: './dist/',
    clean: true,
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.tsx?$/,
  //       use: 'ts-loader',
  //       exclude: /node_modules/,
  //     },
  //   ],
  // },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "fs": false,
      "path": false,
      "stream": false,
    }
  },
};
