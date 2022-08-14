#!/usr/bin/env -S node --use_strict --experimental-modules --experimental-import-meta-resolve

import { join, relative } from 'path';
import { readFile, readdir, stat, writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { tmpdir } from 'os';

const PRELOAD_PLACEHOLDER = '<!-- preload -->';

const DIST_DIR = './dist';
const STATIC_DIR = './static';

const ENTRY_HTML_TEMPLATE_FILE = './static/index.html';
const ENTRY_HTML_FILE = './index.html';

const ID_FILE = './id.txt';
const INDEX_FILE = './index.json';

const HASH_EXCLUSIONS = [
  new RegExp('.DS_Store$'),
  new RegExp('.js.map$'),
  new RegExp('^/id.txt$'),
  new RegExp('^/index.html$'),
  new RegExp('^/index.json$'),
];

const INDEX_EXCLUSIONS = [
  new RegExp('^/id.txt$'),
  new RegExp('^/index.json$'),
  new RegExp('^/js/workers/sw.js$'),
  new RegExp('^/manifest.json$'),
];

const LIST_EXCLUSIONS = [
  new RegExp('.DS_Store$'),
  new RegExp('.js.map$'),
  new RegExp('^/index.html$'),
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

/* eslint-disable sort-keys */
const PRELOAD_TYPES = {
  script: [
    new RegExp('^/js/app/(?!index).*.js$'),
    new RegExp('^/js/lib/.*.js$'),
  ],
  fetch: [new RegExp('.txt$'), new RegExp('.json$')],
  worker: [new RegExp('^/js/workers/.*.js$')],
  // image: [new RegExp('.ico$'), new RegExp('.jpg$'), new RegExp('.png$')],
};
/* eslint-enable sort-keys */

const SEPARATOR = Buffer.from(':');

const NGINX_CONFIG = './nginx/main.conf';

const tasks = process.argv[process.argv.length - 1].split(',');

async function precacheIndex() {
  const distDir = join(process.cwd(), DIST_DIR);

  const entryHtmlFile = join(distDir, ENTRY_HTML_FILE);
  const indexFile = join(distDir, INDEX_FILE);
  const idFile = join(distDir, ID_FILE);

  /**
   * @type {string[]}
   */
  const hashes = [];

  /**
   * @param {string} path
   * @param {string} root
   * @returns {Promise<string[]>}
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
        LIST_EXCLUSIONS.find((exclusion) => {
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

  const fileList = [
    (
      await Promise.all(
        [DIST_DIR, STATIC_DIR].map(async (path) => {
          const absolutePath = join(process.cwd(), path);

          return walk(absolutePath, absolutePath);
        })
      )
    ).flat(1),
    `/${relative(distDir, idFile)}`,
    `/${relative(distDir, indexFile)}`,
  ]
    .flat(1)
    .sort()
    .sort((a, b) => (a?.length || 0) - (b?.length || 0))
    .sort(
      (a, b) => (a?.split('/')?.length || 0) - (b?.split('/')?.length || 0)
    );

  const preloadList = Object.fromEntries(
    Object.entries(PRELOAD_TYPES).map(([type, matchers]) => {
      const matchingFiles = [];

      for (const matcher of matchers) {
        for (const index of fileList) {
          if (!matcher.test(index)) continue;
          matchingFiles.push(index);
        }
      }

      return [type, matchingFiles];
    })
  );

  const indexList = fileList.filter(
    (entry) => !INDEX_EXCLUSIONS.find((exclusion) => exclusion.test(entry))
  );

  const cacheInventory = Object.fromEntries(
    Object.entries(INDEX_TIERS).map(([tier, matchers]) => {
      const matchingFiles = [];

      for (const matcher of matchers) {
        for (const index of indexList) {
          if (!matcher.test(index)) continue;
          matchingFiles.push(index);
        }
      }

      return [tier, matchingFiles];
    })
  );

  const cacheInventoryPayload = Buffer.from(
    `${JSON.stringify(cacheInventory)}\n`
  );

  hashes.push(
    createHash('md5')
      .update(
        Buffer.concat([
          Buffer.from(indexFile),
          SEPARATOR,
          cacheInventoryPayload,
        ])
      )
      .digest('hex')
  );

  const entryHtmlTemplate = await readFile(ENTRY_HTML_TEMPLATE_FILE, {
    encoding: 'utf8',
  });
  const preloadTags = [];

  for (const [type, urls] of Object.entries(preloadList)) {
    for (const url of urls) {
      preloadTags.push(
        `<link rel="preload" crossorigin="use-credentials" as="${type}" href="${url}">`
      );
    }
  }

  const entryHtmlPayload = Buffer.from(
    entryHtmlTemplate.replace(
      PRELOAD_PLACEHOLDER,
      preloadTags.map((tag, index) => `${index ? '  ' : ''}${tag}`).join('\n')
    ),
    'utf8'
  );

  hashes.push(
    createHash('md5')
      .update(
        Buffer.concat([Buffer.from(entryHtmlFile), SEPARATOR, entryHtmlPayload])
      )
      .digest('hex')
  );

  const globalHash = createHash('md5')
    .update(hashes.sort().join(':'))
    .digest('hex');

  await Promise.all([
    writeFile(entryHtmlFile, entryHtmlPayload),
    writeFile(indexFile, cacheInventoryPayload),
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
    await promisify(execFile)('./scripts/copy-additional-files.sh');

    await precacheIndex();
  }

  if (tasks.includes('serve')) {
    await nginx();
  }
})();
