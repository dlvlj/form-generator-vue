module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    // 'plugin:vue/essential',
    'plugin:vue/vue3-recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    camelcase: 'off',
    'comma-dangle': 'off',
    'newline-per-chained-call': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
    'guard-for-in': 'off',
    eqeqeq: 'off',
    'consistent-return': 'off',
    'no-restricted-syntax': 'off',
    'import/named': 'off',
    'func-names': 'off'
    // 'no-console': 'off'
  },
};
