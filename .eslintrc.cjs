module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    webextensions: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
  },
  ignorePatterns: ['dist/**', 'node_modules/**', 'tests/fixtures/**', 'design/**'],
};
