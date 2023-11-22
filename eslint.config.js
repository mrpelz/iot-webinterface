import {
  config,
  configMeta,
  plugins,
  rules,
  // @ts-ignore
} from '@mrpelz/boilerplate-common/config/eslint.config.js';
// @ts-ignore
import pluginReactHooks from 'eslint-plugin-react-hooks';

Object.assign(plugins, { 'react-hooks': pluginReactHooks });
Object.assign(rules, { ...pluginReactHooks.configs.recommended.rules });

config.files = ['src/app/**/*.{js,ts,tsx}'];

/** @type {import('eslint').Linter.FlatConfig} */
const configWorkers = {
  ...config,
  files: ['src/workers/**/*.{js,ts}'],
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...config.languageOptions?.parserOptions,
      project: 'src/workers/tsconfig.json',
    },
  },
  settings: {
    ...config.settings,
    'import/resolver': {
      typescript: {
        enforceExtension: true,
        extensionAlias: {
          '.js': ['.js', '.ts'],
        },
        project: 'src/workers/tsconfig.json',
      },
    },
  },
};

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [configMeta, config, configWorkers];
