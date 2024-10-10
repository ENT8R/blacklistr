import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended, {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      semi: 'warn',
      'semi-style': 'error',
      'semi-spacing': 'warn',
      camelcase: 'error',

      quotes: ['warn', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: false,
      }],

      'brace-style': 'error',
      indent: ['error', 2],
      'no-eval': 'error',
      'no-implied-eval': 'error',

      'prefer-const': 'error',
      'no-var': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'warn',
      'template-curly-spacing': 'warn',
      'symbol-description': 'error',
      'object-shorthand': 'warn',
      'prefer-promise-reject-errors': 'error',
      'prefer-destructuring': 'warn',
      'prefer-numeric-literals': 'warn',

      'no-new-object': 'error',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'all'],
      'dot-location': ['error', 'property'],
      'dot-notation': 'error',
      'no-array-constructor': 'error',
      'no-throw-literal': 'error',
      'no-self-compare': 'error',
      'no-useless-call': 'warn',
      'spaced-comment': 'warn',
      'no-multi-spaces': 'warn',
      'no-new-wrappers': 'error',
      'no-script-url': 'error',
      'no-void': 'warn',
      'vars-on-top': 'warn',
      'require-await': 'warn'
    }
  }];
