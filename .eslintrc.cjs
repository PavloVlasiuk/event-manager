const prettierConfig = require('./.prettierrc.cjs')

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.cjs'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': 'error',
    'block-spacing': 'error',
    'brace-style': 'error',
    'comma-spacing': 'error',
    'func-call-spacing': 'error',
    'rest-spread-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'indent': ['error', 2],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'new-parens': 'error',
    'quotes': ['error', 'single'],
    'space-before-blocks': 'error',
    'space-in-parens': 'error',
    'eqeqeq': ['error', 'smart'],
    'prettier/prettier': ['error', prettierConfig],
  },
};
