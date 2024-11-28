import {
  config as configUpstream,
  configMeta,
  // @ts-ignore
} from '@mrpelz/boilerplate-preact/eslint.config.js';
import { merge } from 'ts-deepmerge';

/** @type {import('eslint').Linter.Config} */
export const configApp = merge(configUpstream);
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
export const configWorkers = merge(configUpstream, configDownstreamWorkers);
configWorkers.files = ['src/workers/**/*.{js,ts}'];

/** @type {import('eslint').Linter.Config[]} */
export default [configMeta, configApp, configWorkers];
