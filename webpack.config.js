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
  ReplaceOperation,
} from 'modify-source-webpack-plugin';
import { stripIndents } from 'proper-tags';
import { prerelease } from 'semver';
import { InjectManifest } from 'workbox-webpack-plugin';

const {
  API_PROXY: apiProxy,
  GIT_BRANCH: gitBranch,
  PKG_NAME: pkgName,
  PKG_VERSION: pkgVersion,
} = process.env;

const slug = (() => {
  if (webpackServe) {
    if (!gitBranch || gitBranch === 'main') return 'local';

    return `local-${gitBranch.replaceAll(/(?:\W|_)/g, '-')}`;
  }

  if (!pkgVersion) {
    return undefined;
  }

  const [prereleaseName] = prerelease(pkgVersion) ?? [];
  if (!prereleaseName) {
    return 'prod';
  }

  return `pre-${prereleaseName}`;
})();

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
          ...(webpackServe
            ? [
                new ConcatOperation(
                  'start',
                  stripIndents`
                    import 'preact/debug';

                  `,
                ),
              ]
            : []),
          new ReplaceOperation(
            'once',
            '// <ModifySourcePlugin>\n',
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

              window.__pkgName__ = '${pkgName}';
              window.__pkgVersion__ = '${pkgVersion}';
              window.__slug__ = '${slug}';
              window.__webpackServe__ = ${webpackServe ? 'true' : 'false'};

              ${webpackServe ? 'if (module.hot) module.hot.accept();' : ''}
            `,
          ),
        ],
        test: new RegExp(`^${path.resolve(dirSrc, 'app/main.ts')}$`),
      },
      {
        operations: [
          new ReplaceOperation(
            'once',
            '// <ModifySourcePlugin>\n',
            stripIndents`
              self.__slug__ = '${slug}';
              self.__webpackServe__ = ${webpackServe ? 'true' : 'false'};

              ${webpackServe ? 'if (module.hot) module.hot.accept();' : ''}
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
