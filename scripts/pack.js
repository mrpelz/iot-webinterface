#!/usr/bin/env node --use_strict --experimental-modules --experimental-import-meta-resolve

import { join, relative } from 'path';
import { readdir, stat, writeFile } from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';

const DIST_DIR = './dist';
const STATIC_DIR = './static';

const ID_FILE = './id.txt';
const INDEX_FILE = './index.json';

const INDEX_EXCLUSIONS = [
  new RegExp('.js.map$'),
  new RegExp('^\\/id.txt'),
  new RegExp('^\\/index.json'),
  new RegExp('sw.js$'),
];

const INDEX_TIERS = [
  new RegExp('^\\/manifest.json$'),
  new RegExp('^\\/index.html$'),
  new RegExp('^\\/js\\/'),
  new RegExp('^\\/images\\/icons\\/'),
  new RegExp('^\\/images\\/splash\\/'),
  new RegExp('^\\/images\\/background\\/'),
];

const NGINX_CONFIG = './nginx.conf';

const tasks = process.argv[process.argv.length - 1].split(',');

async function precacheIndex() {
  const indexFile = join(process.cwd(), DIST_DIR, INDEX_FILE);

  const walk = async (path, root) => {
    const stats = await stat(path);

    if (stats.isFile()) {
      const relativePath = relative(root, path);
      const prefixedPath = `/${relativePath}`;

      if (
        INDEX_EXCLUSIONS.find((exclusion) => {
          return exclusion.test(prefixedPath);
        })
      ) {
        return [];
      }

      return [prefixedPath];
    }

    if (!stats.isDirectory()) return [];

    const entries = await readdir(path);
    const lists = await Promise.all(
      entries.map(async (entry) => walk(join(path, entry), root))
    );

    return lists.flat();
  };

  const fileList = (
    await Promise.all(
      [DIST_DIR, STATIC_DIR].map(async (path) => {
        const absolutePath = join(process.cwd(), path);

        return walk(absolutePath, absolutePath);
      })
    )
  )
    .flat()
    .sort();

  const result = [
    ...INDEX_TIERS.map((tier) => fileList.filter((file) => tier.test(file))),
    fileList.filter((file) => {
      for (const tier of INDEX_TIERS) {
        if (tier.test(file)) return false;
      }
      return true;
    }),
  ].flat();

  const filePayload = JSON.stringify(result, null, 2);

  await writeFile(indexFile, `${filePayload}\n`);
}

async function writeId() {
  const id = Date.now();

  const idFile = join(process.cwd(), DIST_DIR, ID_FILE);
  await writeFile(idFile, `${id}`);
}

async function nginx() {
  const config = join(process.cwd(), NGINX_CONFIG);

  const bin = await promisify(execFile)('which', ['nginx'])
    .then(({ stdout }) => stdout.trim() || null)
    .catch(() => null);

  if (!bin) {
    // eslint-disable-next-line no-console
    console.error(
      "please install nginx and try again, make sure it's in your PATH"
    );

    return;
  }

  const fn = () => {
    const childProcess = execFile(bin, ['-p', process.cwd(), '-c', config]);

    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stdout);

    childProcess.once('close', () => {
      childProcess.kill();
      fn();
    });
  };

  fn();
}

(async () => {
  if (tasks.includes('transform')) {
    await promisify(execFile)('native-esm-transform');

    await precacheIndex();
    await writeId();
  }

  if (tasks.includes('serve')) {
    await nginx();
  }
})();
