/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended-type-checked', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname
  },
  root: true,
  rules: {
    'no-console': 'error',
    'dot-notation': 'error',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/require-await': 'off'
  }
}

// module.exports = {
//   parser: '@typescript-eslint/parser',
//   plugins: ['@typescript-eslint'],
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'prettier',
//     'prettier/@typescript-eslint'
//   ],
//   rules: {
//     // Add your own rules here
//   }
// }
