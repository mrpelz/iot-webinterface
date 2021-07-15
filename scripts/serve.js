#!/usr/bin/env node --use_strict --experimental-modules --experimental-import-meta-resolve

import { appendFile, readdir, stat, writeFile } from 'fs/promises';
import { join, relative } from 'path';
import { NginxBinary } from 'nginx-binaries';
import { exec } from 'child_process';
import { promisify } from 'util';

const DIST_DIR = './dist';

const INDEX_FILE = './index.json';
const INDEX_EXCLUSIONS = [
  new RegExp('.js.map$'),
  new RegExp('^\\/id.json'),
  new RegExp('^\\/index.json'),
  new RegExp('^\\/manifest.json'),
  new RegExp('^\\/src'),
];

const ID_FILE = './id.json';
const SW_FILE = './js/workers/sw.js';

const isServe = process.argv[process.argv.length - 1] === 'serve';

async function precacheIndex() {
  const root = join(process.cwd(), DIST_DIR);
  const indexFile = join(process.cwd(), DIST_DIR, INDEX_FILE);

  const walk = async (path) => {
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
      entries.map(async (entry) => walk(join(path, entry)))
    );

    return lists.flat();
  };

  const result = (await walk(root)).flat().sort();
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

(async () => {
  const nginxBinary = await NginxBinary.download({});

  await promisify(exec)('npm run --silent transform');
  await precacheIndex();
  await swCheat();

  if (!isServe) return;

  // eslint-disable-next-line no-console
  console.log(await promisify(exec)(`${nginxBinary} -h`));
})();
