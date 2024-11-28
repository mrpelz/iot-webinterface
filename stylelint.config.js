import { execSync } from 'node:child_process';
import path from 'node:path';

/** @type {import('stylelint').Config} */
export default {
  extends: [
    path.resolve(
      execSync('npm ls --parseable "@mrpelz/boilerplate-preact"', {
        encoding: 'utf8',
      }).trim(),
      'stylelint.config.js',
    ),
  ],
};
