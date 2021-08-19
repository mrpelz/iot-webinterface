export const entryPaths = [
  'build/app/index.js',
  'build/workers/auto-reload.js',
  'build/workers/sw.js',
  'build/workers/utils/main.js',
  'build/workers/utils/worker-scaffold.js',
  'build/workers/web-api.js',
];

export const rootMap = {
  build: 'dist/js',
  node_modules: 'dist/js/lib',
};

export const write = true;
