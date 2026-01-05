import { execSync } from 'node:child_process';
import path from 'node:path';

import {
  dirBase,
  dirDist,
  dirSrc,
  webpackServe,
  // @ts-ignore
} from '@mrpelz/boilerplate-dom/webpack.config.js';
// @ts-ignore
import configUpstream from '@mrpelz/boilerplate-preact/webpack.config.js';
import CopyPlugin from 'copy-webpack-plugin';
import { deepmerge } from 'deepmerge-ts';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { glob } from 'glob';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {
  ConcatOperation,
  ModifySourcePlugin,
} from 'modify-source-webpack-plugin';
import { stripIndents } from 'proper-tags';
import { InjectManifest } from 'workbox-webpack-plugin';

const version = execSync('npm pkg get "version" --silent', { encoding: 'utf8' })
  .replaceAll('\n', '')
  .replaceAll('"', '');

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
        context: ['/api/version'],
        pathRewrite: { '^/api': '' },
        target: API_PROXY,
      },
      {
        changeOrigin: true,
        context: ['/api/log'],
        pathRewrite: { '^/api': '' },
        target: API_PROXY,
      },
      {
        changeOrigin: true,
        context: ['/api/logic-reasoning'],
        pathRewrite: { '^/api': '' },
        target: API_PROXY,
      },
      {
        changeOrigin: true,
        context: ['/api'],
        target: API_PROXY,
      },
    ],
  },
  output: {
    assetModuleFilename: 'assets/[name][ext]',
    chunkFormat: false,
    publicPath: '/',
  },
};

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const config = deepmerge(configUpstream, configDownstream);

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
            transpileOnly: true,
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
            transpileOnly: true,
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
            stripIndents`
              ${glob
                .sync(path.resolve(dirSrc, 'common/images/background/*'))
                .map((path_) =>
                  path.relative(path.resolve(dirSrc, 'app'), path_),
                )
                .map((path_) => `import '${path_}';`)
                .join('\n')}

              // @ts-ignore
              __webpack_base_uri__ = new URL('/', location.href).href;

              window.__version__ = '${version}';
              window.__webpackServe__ = ${webpackServe ? 'true' : 'false'};

            `,
          ),
        ],
        test: new RegExp(`^${path.resolve(dirSrc, 'app/main.ts')}$`),
      },
      {
        operations: [
          new ConcatOperation(
            'start',
            stripIndents`
              self.__webpackServe__ = ${webpackServe ? 'true' : 'false'};

            `,
          ),
        ],
        test: new RegExp(`^${path.resolve(dirSrc, 'workers/sw.ts')}$`),
      },
    ],
  }),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    scriptLoading: 'module',
    template: path.resolve(dirSrc, 'common/main.html'),
  }),
  new CopyPlugin({
    patterns: [
      {
        context: path.resolve(dirSrc, 'common'),
        from: path.resolve(dirSrc, 'common/manifest.json'),
        to: path.resolve(dirDist, 'main.webmanifest'),
      },
      {
        context: path.resolve(dirSrc, 'common/icons'),
        from: path.resolve(dirSrc, 'common/icons/*'),
        to: path.resolve(dirDist, 'assets'),
      },
    ],
  }),
  (() => {
    const workboxPlugin = new InjectManifest({
      maximumFileSizeToCacheInBytes: 10 * 1_000_000,
      swSrc: path.resolve(dirSrc, 'workers/sw.ts'),
    });

    if (webpackServe) {
      Object.defineProperty(workboxPlugin, 'alreadyCalled', {
        get() {
          return false;
        },
        set() {
          //
        },
      });
    }

    return workboxPlugin;
  })(),
  new ForkTsCheckerWebpackPlugin(),
];

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
export default config;
