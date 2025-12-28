module.exports = [
  // ignore generated and dependency folders
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**', '.husky/**', 'autoGen/**'] },

  // apply to JavaScript files
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: { prettier: require('eslint-plugin-prettier') },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
    },
  },
];
