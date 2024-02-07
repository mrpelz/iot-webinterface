import { resolve } from 'node:path';

import {
  dirBase,
  dirSrc,
  dirStatic,
  // @ts-ignore
} from '@mrpelz/boilerplate-dom/webpack.config.js';
// @ts-ignore
import configUpstream from '@mrpelz/boilerplate-preact/webpack.config.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { merge } from 'ts-deepmerge';
import { InjectManifest } from 'workbox-webpack-plugin';

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const configDownstream = {
  devServer: {
    client: {
      overlay: false,
    },
    historyApiFallback: true,
    hot: false,
    liveReload: false,
  },
};

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const config = merge(configUpstream, configDownstream);

config.entry = [
  resolve(dirSrc, 'app/main.ts'),
  resolve(dirSrc, 'app/main.css'),
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
    template: resolve(dirStatic, 'main.html'),
  }),
  new InjectManifest({
    swSrc: resolve(dirSrc, 'workers/sw.ts'),
  }),
];

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
export default config;
