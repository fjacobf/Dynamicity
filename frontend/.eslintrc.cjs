const stylistic = require('@stylistic/eslint-plugin')

const customized = stylistic.configs.customize({
  // the following options are the default values
  indent: 2,
  quotes: 'single',
  semi: false,
  jsx: true,
  // ...
})

module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true, },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@stylistic/recommended-extends'
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs'
  ],
  parserOptions: { 
    ecmaVersion: 'latest', 
    sourceType: 'module',
    jsx: true,
   },
  settings: { 
    react: { version: '18.2' } 
  },
  plugins: [
    'react-refresh',
    '@stylistic'
  ],
  rules: {
    ...customized.rules,
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
