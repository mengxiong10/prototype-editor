const path = require('path');

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, './build/webpack.base.conf'),
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  rules: {
    'no-console':
      process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error'] }] : 'off',
    // 对象声明都必须用解构: 关闭
    'prefer-destructuring': 0,
    // 禁止for of: 关闭
    'no-restricted-syntax': 0,
    // 禁止++ 主要是不加分号可能语法混乱, 这里都加分号直接关闭.
    'no-plusplus': 0,
    // hasOwnProperty 等自己注意就好,没必要一定要Object.prototype.hasOwnProperty.call()
    'no-prototype-builtins': 0,

    'no-unused-expressions': [2, { allowShortCircuit: true, allowTernary: true }],
    // 重新分配函数参数 forEach immer 中很多问题, 使用typescript readonly
    'no-param-reassign': 0,
    'class-methods-use-this': 0,

    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'react/jsx-no-target-blank': 0,
    'react/destructuring-assignment': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-props-no-spreading': 0,
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: false,
      },
    ],
    'react/sort-comp': [
      1,
      {
        order: ['everything-else', 'render'],
      },
    ],
    'react/static-property-placement': ['warn', 'static public field'],
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    // 每个函数需要明确的返回的type: 关闭
    '@typescript-eslint/explicit-function-return-type': 0,

    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/array-type': [2, { default: 'array' }],
    '@typescript-eslint/explicit-member-accessibility': 0,

    // 必须是package.json里面的包: 1
    'import/no-extraneous-dependencies': 1,
    'import/prefer-default-export': 0,
  },
};
