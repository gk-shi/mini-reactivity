module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    // "eslint:recommended",
    'standard',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'no-multi-spaces': 'off',
    'space-before-function-paren': 'off',
    'import/no-absolute-path': 'off',
    'no-multiple-empty-lines': 'off',
    // '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
