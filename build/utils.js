'use strict';
const path = require('path');
const config = require('../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packageConfig = require('../package.json');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

exports.assetsPath = function(_path) {
  const assetsSubDirectory =
    process.env.NODE_ENV === 'production'
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function(options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };
  if (options.modules) {
    cssLoader.options = {
      ...cssLoader.options,
      modules: {
        localIdentName: '[name]_[local]_[hash:base64:5]',
      },
    };
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders);
    } else {
      return ['style-loader'].concat(loaders);
    }
  }

  return {
    css: generateLoaders(),
    less: generateLoaders('less'),
    scss: generateLoaders('sass'),
  };
};

exports.styleLoaders = function(options) {
  const output = [];
  const loaders = exports.cssLoaders(options);
  const moduleLoaders = exports.cssLoaders({ ...options, modules: true });
  for (const extension in moduleLoaders) {
    const loader = loaders[extension];
    const moduleLoader = moduleLoaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      oneOf: [
        {
          test: new RegExp('\\.module\\.' + extension + '$'),
          exclude: /node_module/,
          use: moduleLoader,
        },
        {
          use: loader,
        },
      ],
    });
  }
  return output;
};

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png'),
    });
  };
};
