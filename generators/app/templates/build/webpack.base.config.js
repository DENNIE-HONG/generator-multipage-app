/**
 * @file wepack 基础配置
 * @author hongluyan
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const glob = require('glob');
const { WEBPACK_COMMON_CONFIG } = require('../config');
module.exports = (env) => {
  let entryFiles = glob.sync('src/views/**/*.js');
  let entries = {};
  entryFiles.forEach(file => {
    let name = path.basename(file, '.js');
    entries[name] = './' + file;
  });
  let config = {
    entry: entries,
    resolve: {
      extensions: ['.js'],
      alias: {
        assets: path.resolve(__dirname, '../src/assets'),
      }
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          common: {
            minChunks: 3,
            name: 'common',
            minSize: 0,
            chunks: 'all'
          },
          vendors: {
            test: /node_modules/,
            name: 'vendors',
            priority: 10, // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
            enforce: true,
            chunks: 'all'
          }
        }
      },
      runtimeChunk: {
        name: 'manifest'
      }
    },
    plugins: [
      new CleanWebpackPlugin([
        `${WEBPACK_COMMON_CONFIG.assetsDirectory}/*`
      ], {
        root: WEBPACK_COMMON_CONFIG.projectRoot
      }),
      new WriteFilePlugin({
        test: /\.html$/
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, '../src'),
          use: [
            'babel-loader',
            'eslint-loader'
          ],
          exclude: [/node_modules/]
        },
        {
          test: /\.(css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: env.production ? false: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: env.production ? false: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: env.production ? false: true
              }
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [path.resolve(__dirname, '../src/assets/vars.scss'), path.resolve(__dirname, '../src/assets/mixins.scss')]
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 2048,
                name: env.production ? 'fonts/[name].[hash:7].[ext]' : 'fonts/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                removeComments: false
              }
            }
          ]
        }
      ]
    }
  };
  moreWebpackPlugin(config, env.production);
  return config;

};
/**
 * 生成html文件
 * @param {Object}  webpack配置对象
 * @param {Boolean} 是否是生产环境
*/
function moreWebpackPlugin (config, isProd) {
  let pages = glob.sync('src/views/**/*.html');
  pages.map((filepath)=>{
    let fileName = path.basename(filepath, '.html');
    let conf = {
      chunks: ['manifest', 'common', 'vendor', fileName],
      filename: path.resolve(__dirname, `${WEBPACK_COMMON_CONFIG.assetsViews}/${fileName}.html`),
      template: filepath,
      chunksSortMode: 'manual'
    };
    if (isProd) {
      conf = Object.assign(conf, {
        minify: {
          removeComments: true, //去除注释
          collapseWhitespace: true, //去除空格
          minifyJS: true //压缩内联script
        }
      });
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
  });
}
