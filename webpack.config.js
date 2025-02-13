import path from 'node:path';

import {
  dirBase,
  dirSrc,
  // @ts-ignore
} from '@mrpelz/boilerplate-dom/webpack.config.js';
// @ts-ignore
import configUpstream from '@mrpelz/boilerplate-preact/webpack.config.js';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import { glob } from 'glob';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {
  ConcatOperation,
  ModifySourcePlugin,
} from 'modify-source-webpack-plugin';
import { merge } from 'ts-deepmerge';
import { InjectManifest } from 'workbox-webpack-plugin';

// const API_PROXY = 'http://localhost:1337';
const API_PROXY =
  'https://iot-iot-monolith-latest.rancher-iot.lan.wurstsalat.cloud';

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const configDownstream = {
  devServer: {
    allowedHosts: 'all',
    client: false,
    historyApiFallback: true,
    host: '::1',
    hot: false,
    liveReload: false,
    proxy: [
      {
        changeOrigin: true,
        context: ['/api/stream'],
        target: API_PROXY,
        ws: true,
      },
      {
        changeOrigin: true,
        context: ['/api'],
        target: API_PROXY,
      },
    ],
    webSocketServer: false,
  },
  output: {
    assetModuleFilename: 'assets/[name][ext]',
    chunkFormat: false,
    publicPath: '/',
  },
};

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const config = merge(configUpstream, configDownstream);

config.entry = [
  path.resolve(dirSrc, 'app/main.ts'),
  path.resolve(dirSrc, 'common/main.css'),
];

if (config.module) {
  config.module.rules = [
    {
      exclude: /node_modules/,
      include: path.resolve(dirSrc, 'app'),
      test: /\.tsx?$/i,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(dirBase, 'tsconfig.build.json'),
          },
        },
      ],
    },
    {
      exclude: /node_modules/,
      include: path.resolve(dirSrc, 'workers'),
      test: /\.ts$/i,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(dirSrc, 'workers/tsconfig.build.json'),
          },
        },
      ],
    },
    {
      enforce: 'pre',
      exclude: /node_modules/,
      test: /\.js$/i,
      use: ['source-map-loader'],
    },
    {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      test: /\.png$/i,
      type: 'asset/resource',
    },
  ];
}

config.plugins = [
  new ModifySourcePlugin({
    rules: [
      {
        operations: [
          new ConcatOperation(
            'start',
            `// @ts-expect-error
            __webpack_base_uri__ = new URL('/', location.href).href;\n\n`,
          ),
          new ConcatOperation(
            'start',
            glob
              .sync(path.resolve(dirSrc, 'common/images/background/*'))
              .map((path_) => path.relative(path.resolve(dirSrc, 'app'), path_))
              .map((path_) => `import "${path_}";`)
              .join('\n'),
          ),
        ],
        test: new RegExp(`^${path.resolve(dirSrc, 'app/main.ts')}$`),
      },
    ],
  }),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    scriptLoading: 'module',
    template: path.resolve(dirSrc, 'common/main.html'),
  }),
  new FaviconsWebpackPlugin({
    logo: path.resolve(dirSrc, 'common/icon.svg'),
    manifest: path.resolve(dirSrc, 'common/manifest.json'),
    mode: 'webapp',
  }),
  new InjectManifest({
    maximumFileSizeToCacheInBytes: 10 * 1_000_000,
    swSrc: path.resolve(dirSrc, 'workers/sw.ts'),
  }),
];

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
export default config;
