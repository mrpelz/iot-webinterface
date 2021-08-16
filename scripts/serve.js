#!/usr/bin/env node --use_strict --experimental-modules --experimental-import-meta-resolve

import { appendFile, readdir, stat, writeFile } from 'fs/promises';
import { join, relative } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const DIST_DIR = './dist';
const STATIC_DIR = './static';

const ID_FILE = './id.json';
const SW_FILE = './js/workers/sw.js';
const INDEX_FILE = './index.json';

const INDEX_EXCLUSIONS = [
  new RegExp('.js.map$'),
  new RegExp('^\\/id.json'),
  new RegExp('^\\/index.json'),
  new RegExp('sw.js$'),
];

const NGINX_CONFIG = './nginx.conf';

async function precacheIndex() {
  const distDir = join(process.cwd(), DIST_DIR);
  const staticDir = join(process.cwd(), STATIC_DIR);

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

  const result = [
    (await walk(distDir, distDir)).flat(),
    (await walk(staticDir, staticDir)).flat(),
  ]
    .flat()
    .sort();

  const filePayload = JSON.stringify(result, null, 2);

  await writeFile(indexFile, `${filePayload}\n`);
}

async function swCheat() {
  const id = Date.now();
  const filePayload = JSON.stringify({ id }, null, 2);

  const idFile = join(process.cwd(), DIST_DIR, ID_FILE);
  const swFile = join(process.cwd(), DIST_DIR, SW_FILE);

  await writeFile(idFile, `${filePayload}\n`);
  await appendFile(swFile, `\n// SW_CHEAT:${id}`);
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

  const childProcess = execFile(bin, ['-p', process.cwd(), '-c', config]);

  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stdout);
}

(async () => {
  await promisify(execFile)('npm', ['run', '--silent', 'transform']);

  await precacheIndex();
  await swCheat();
  await nginx();
})();
