module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
    plugins: [
      ['@babel/plugin-syntax-dynamic-import'],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-optional-chaining'],
      'react-hot-loader/babel',
      'lodash',
      ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
    ],
  };
};
