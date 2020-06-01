'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
  test: /\.(t|j)sx?$/,
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  use: [
    {
      loader: 'eslint-loader',
    },
  ],
});

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
  },
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '@': resolve('src'),
    },
  },
  externals: {},
  module: {
    rules: [
      ...(config.dev.useLint ? [createLintingRule()] : []),
      {
        test: /\.(t|j)sx?$/,
        include: [resolve('src'), resolve('node_modules/my-react-common')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: resolve('babel.config.js'),
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [resolve('src/svg')],
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgProps: { className: 'svg-icon' },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: [resolve('src/svg')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('img/[name].[hash:7].[ext]'),
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('media/[name].[hash:7].[ext]'),
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
            },
          },
        ],
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    Buffer: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
