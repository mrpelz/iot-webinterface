/* eslint-disable unicorn/prefer-string-raw */
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
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
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

const version = execSync('npm pkg get "version" --silent', {
  encoding: 'utf8',
}).replaceAll(/[\n"]/g, '');

const apiProxy = process.env.API_PROXY;

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const configDownstream = {
  devServer: {
    allowedHosts: 'all',
    client: {
      overlay: false,
      reconnect: true,
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
    historyApiFallback: true,
    host: '::1',
    hot: webpackServe,
    liveReload: false,
    proxy: [
      {
        changeOrigin: true,
        context: ['/api/stream'],
        target: apiProxy,
        ws: true,
      },
      {
        changeOrigin: true,
        context: ['/api/version'],
        pathRewrite: { '^/api': '' },
        target: apiProxy,
      },
      {
        changeOrigin: true,
        context: ['/api/log'],
        pathRewrite: { '^/api': '' },
        target: apiProxy,
      },
      {
        changeOrigin: true,
        context: ['/api/logic-reasoning'],
        pathRewrite: { '^/api': '' },
        target: apiProxy,
      },
      {
        changeOrigin: true,
        context: ['/api'],
        target: apiProxy,
      },
      {
        context: ['/__proxy-api-hostname'],
        target: apiProxy,
      },
    ],
    /**
     *
     * @type {import('webpack-dev-server').Configuration['setupMiddlewares']}
     */
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app?.get('/__proxy-api-hostname', (_request, response) => {
        response.send(apiProxy);
      });

      return middlewares;
    },
  },
  output: {
    assetModuleFilename: 'assets/[name][ext]',
    publicPath: '/',
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
    conditionNames: ['import'],
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
      use: [MiniCssExtractPlugin.loader, 'css-loader', '@tailwindcss/webpack'],
    },
    {
      test: /\.png$/i,
      type: 'asset/resource',
    },
  ];
}

config.optimization = {
  minimize: true,
  minimizer: [
    '...',
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          'default',
          {
            calc: false,
          },
        ],
      },
    }),
  ],
};

config.plugins = [
  new ModifySourcePlugin({
    rules: [
      {
        operations: [
          new ConcatOperation(
            'start',
            stripIndents`
              ${webpackServe ? String.raw`import 'preact/debug';` : ''}
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
      {
        context: path.resolve(dirSrc, 'common/fonts'),
        from: path.resolve(dirSrc, 'common/fonts/*'),
        to: path.resolve(dirDist, 'assets'),
      },
    ],
  }),
  (() => {
    const workboxPlugin = new InjectManifest({
      maximumFileSizeToCacheInBytes: 20 * 1_000_000,
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
