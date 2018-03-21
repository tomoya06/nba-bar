const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const baseConfig = require('./webpack.config.base');

const config = merge(baseConfig, {
  mode: 'production',

  entry: ['babel-polyfill', './src/index'],

  output: {
    publicPath: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop'),
    new UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
});

module.exports = config;
