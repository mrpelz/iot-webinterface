import {
  config as configUpstream,
  configMeta,
  // @ts-ignore
} from '@mrpelz/boilerplate-preact/eslint.config.js';
import { deepmerge } from 'deepmerge-ts';

/** @type {import('eslint').Linter.Config} */
export const configApp = deepmerge({}, configUpstream);
configApp.files = ['src/app/**/*.{js,jsx,ts,tsx}'];

if (configApp.rules) {
  configApp.rules['unicorn/class-reference-in-static-methods'] = ['off'];
  configApp.rules['unicorn/max-nested-calls'] = ['off'];
  configApp.rules['unicorn/no-break-in-nested-loop'] = ['off'];
  configApp.rules['unicorn/no-computed-property-existence-check'] = ['off'];
  configApp.rules['unicorn/no-declarations-before-early-exit'] = ['off'];
  configApp.rules['unicorn/no-non-function-verb-prefix'] = ['off'];
  configApp.rules['unicorn/no-top-level-assignment-in-function'] = ['off'];
  configApp.rules['unicorn/no-top-level-side-effects'] = ['off'];
  configApp.rules['unicorn/no-unreadable-for-of-expression'] = ['off'];
  configApp.rules['unicorn/no-unreadable-object-destructuring'] = ['off'];
  configApp.rules['unicorn/no-unsafe-property-key'] = ['off'];
  configApp.rules['unicorn/no-useless-template-literals'] = ['off'];
  configApp.rules['unicorn/prefer-array-from-map'] = ['off'];
  configApp.rules['unicorn/prefer-boolean-return'] = ['off'];
  configApp.rules['unicorn/prefer-direct-iteration'] = ['off'];
  configApp.rules['unicorn/prefer-else-if'] = ['off'];
  configApp.rules['unicorn/prefer-global-number-constants'] = ['off'];
  configApp.rules['unicorn/prefer-global-this'] = ['off'];
  configApp.rules['unicorn/prefer-number-is-safe-integer'] = ['off'];
  configApp.rules['unicorn/prefer-single-replace'] = ['off'];
  configApp.rules['unicorn/prefer-unicode-code-point-escapes'] = ['off'];
  configApp.rules['unicorn/require-array-sort-compare'] = ['off'];
}

/** @type {import('eslint').Linter.Config} */
const configDownstreamWorkers = {
  languageOptions: {
    parserOptions: {
      project: 'src/workers/tsconfig.json',
    },
  },
};

/** @type {import('eslint').Linter.Config} */
export const configWorkers = deepmerge(configUpstream, configDownstreamWorkers);
configWorkers.files = ['src/workers/**/*.{js,ts}'];

/** @type {import('eslint').Linter.Config[]} */
export default [configMeta, configApp, configWorkers];
