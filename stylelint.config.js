import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

/** @type {import('stylelint').Config} */
export default {
  extends: [
    resolve(
      execSync('npm ls --parseable "@mrpelz/boilerplate-preact"', {
        encoding: 'utf8',
      }).trim(),
      'stylelint.config.js',
    ),
  ],
};
