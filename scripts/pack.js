#!/usr/bin/env -S node --use_strict --experimental-modules --experimental-import-meta-resolve

import { join, relative } from 'path';
import { readFile, readdir, stat, writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { tmpdir } from 'os';

const DIST_DIR = './dist';
const STATIC_DIR = './static';

const ID_FILE = './id.txt';
const INDEX_FILE = './index.json';

const HASH_EXCLUSIONS = [
  new RegExp('.js.map$'),
  new RegExp('^/id.txt$'),
  new RegExp('^/index.json$'),
];

const INDEX_EXCLUSIONS = [
  new RegExp('.js.map$'),
  new RegExp('^/id.txt$'),
  new RegExp('^/index.html$'),
  new RegExp('^/index.json$'),
  new RegExp('^/js/workers/sw.js$'),
  new RegExp('^/manifest.json$'),
];

const INDEX_TIERS = {
  critical: [
    new RegExp('^/js/'),
    new RegExp('^/images/icons/'),
    new RegExp('^/images/splash/'),
  ],
  optional: [new RegExp('^/images/background/')],
};

const SEPARATOR = Buffer.from(':');

const NGINX_CONFIG = './nginx/main.conf';

const tasks = process.argv[process.argv.length - 1].split(',');

async function precacheIndex() {
  const indexFile = join(process.cwd(), DIST_DIR, INDEX_FILE);
  const idFile = join(process.cwd(), DIST_DIR, ID_FILE);

  /**
   * @type {string[]}
   */
  const hashes = [];

  /**
   * @param {string} path
   * @param {string} root
   * @returns {string[]}
   */
  const walk = async (path, root) => {
    const stats = await stat(path);

    if (stats.isFile()) {
      const relativePath = relative(root, path);
      const prefixedPath = `/${relativePath}`;

      if (
        !HASH_EXCLUSIONS.find((exclusion) => {
          return exclusion.test(prefixedPath);
        })
      ) {
        hashes.push(
          createHash('md5')
            .update(
              Buffer.concat([
                Buffer.from(path),
                SEPARATOR,
                await readFile(path),
              ])
            )
            .digest('hex')
        );
      }

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

  const result = Object.fromEntries(
    Object.entries(INDEX_TIERS).map(([tier, matchers]) => {
      const matchingFiles = [];

      for (const matcher of matchers) {
        for (const file of fileList) {
          if (!matcher.test(file)) continue;
          matchingFiles.push(file);
        }
      }

      return [tier, matchingFiles];
    })
  );

  const filePayload = Buffer.from(`${JSON.stringify(result)}\n`);

  hashes.push(
    createHash('md5')
      .update(Buffer.concat([Buffer.from(indexFile), SEPARATOR, filePayload]))
      .digest('hex')
  );

  const globalHash = createHash('md5')
    .update(hashes.sort().join(':'))
    .digest('hex');

  await Promise.all([
    writeFile(indexFile, filePayload),
    writeFile(idFile, `${globalHash}\n`),
  ]);
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
    const childProcess = execFile(bin, [
      '-p',
      process.cwd(),
      '-c',
      config,
      '-g',
      `pid ${join(tmpdir(), 'nginx.pid')};`,
    ]);

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
  }

  if (tasks.includes('serve')) {
    await nginx();
  }
})();
