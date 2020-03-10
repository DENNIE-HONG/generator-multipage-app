/**
 * @file webpack 开发环境配置
 * @author hongluyan
 */
const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WEBPACK_DEV_CONFIG } = require('../config');
module.exports = env => {
  env.production = env.production !== 'false';
  return merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: WEBPACK_DEV_CONFIG.assetsDirectory,
      watchContentBase: true,
      port: 8888,
      compress: true,
      hot: true,
      publicPath: WEBPACK_DEV_CONFIG.assetsPublicPath,
      overlay: true,
      openPage: `http://localhost:${WEBPACK_DEV_CONFIG.port}`,
      proxy: {
        '*': `http://localhost:${WEBPACK_DEV_CONFIG.port}`
      },
      stats: {
        colors: true,
        modules: false,
        chunks: false,
        children: false,
        chunkModules: false
      },
      watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 200,
        poll: 500
      }
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      })
    ],
    output: {
      filename: 'js/[name].js',
      path: WEBPACK_DEV_CONFIG.assetsDirectory,
      publicPath: WEBPACK_DEV_CONFIG.assetsPublicPath,
      chunkFilename: 'js/[name].js'
    },
    watch: true
  });
};
