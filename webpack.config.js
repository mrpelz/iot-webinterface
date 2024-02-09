import { relative, resolve } from 'node:path';

import {
  dirBase,
  dirSrc,
  dirStatic,
  // @ts-ignore
} from '@mrpelz/boilerplate-dom/webpack.config.js';
// @ts-ignore
import configUpstream from '@mrpelz/boilerplate-preact/webpack.config.js';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import glob from 'glob';
import { PluginForHtmlWebpackPluginV4 } from 'html-inline-css-webpack-plugin/build/core/v4.js';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { merge } from 'ts-deepmerge';
import { InjectManifest } from 'workbox-webpack-plugin';

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const configDownstream = {
  devServer: {
    client: {
      logging: 'error',
      overlay: false,
    },
    historyApiFallback: true,
    hot: false,
    liveReload: true,
    static: [
      {
        directory: resolve(dirBase, 'node_modules'),
        publicPath: '/node_modules',
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  output: {
    publicPath: '',
  },
  performance: false,
};

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const config = merge(configUpstream, configDownstream);

config.entry = [
  resolve(dirSrc, 'app/main.ts'),
  resolve(dirSrc, 'common/main.css'),
];

if (config.module) {
  config.module.rules = [
    {
      exclude: /node_modules/,
      include: resolve(dirSrc, 'app'),
      test: /\.tsx?$/i,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: resolve(dirBase, 'tsconfig.build.json'),
          },
        },
      ],
    },
    {
      exclude: /node_modules/,
      include: resolve(dirSrc, 'workers'),
      test: /\.ts$/i,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: resolve(dirSrc, 'workers/tsconfig.build.json'),
          },
        },
      ],
    },
    {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
  ];
}

config.plugins = [
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: resolve(dirSrc, 'common/main.html'),
  }),
  new HtmlInlineScriptPlugin({
    scriptMatchPattern: [/^main.js$/],
  }),
  new PluginForHtmlWebpackPluginV4(),
  new FaviconsWebpackPlugin({
    logo: resolve(dirSrc, 'common/icon.svg'),
    manifest: resolve(dirSrc, 'common/manifest.json'),
    mode: 'webapp',
  }),
  new InjectManifest({
    additionalManifestEntries: glob
      .sync(resolve(dirStatic, 'images/background/*'))
      .map((path) => relative(dirStatic, path)),
    swSrc: resolve(dirSrc, 'workers/sw.ts'),
  }),
];

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
export default config;
