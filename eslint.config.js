import {
  config as configUpstream,
  configMeta,
  // @ts-ignore
} from '@mrpelz/boilerplate-preact/eslint.config.js';
import { deepmerge } from 'deepmerge-ts';

/** @type {import('eslint').Linter.Config} */
export const configApp = deepmerge({}, configUpstream);
configApp.files = ['src/app/**/*.{js,jsx,ts,tsx}'];

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
