import {
  config as configUpstream,
  configMeta,
  // @ts-ignore
} from '@mrpelz/boilerplate-preact/eslint.config.js';
import { merge } from 'ts-deepmerge';

/** @type {import('eslint').Linter.FlatConfig} */
export const configApp = merge(configUpstream);
configApp.files = ['src/app/**/*.{js,jsx,ts,tsx}'];

/** @type {import('eslint').Linter.FlatConfig} */
const configDownstreamWorkers = {
  languageOptions: {
    parserOptions: {
      project: 'src/workers/tsconfig.json',
    },
  },
};

/** @type {import('eslint').Linter.FlatConfig} */
export const configWorkers = merge(configUpstream, configDownstreamWorkers);
configWorkers.files = ['src/workers/*/*.{js,ts}'];

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [configMeta, configApp, configWorkers];
