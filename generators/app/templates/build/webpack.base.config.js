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
        assets: `${WEBPACK_COMMON_CONFIG.sourceCode}/assets`,
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
          include: WEBPACK_COMMON_CONFIG.sourceCode,
          use: env.production ? 'babel-loader?cacheDirectory' : ['babel-loader?cacheDirectory', 'eslint-loader'],
          exclude: [/node_modules/]
        },
        {
          test: /\.(css|scss)$/,
          include: WEBPACK_COMMON_CONFIG.sourceCode,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: !env.production
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !env.production
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !env.production
              }
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  `${WEBPACK_COMMON_CONFIG.sourceCode}/assets/vars.scss`,
                  `${WEBPACK_COMMON_CONFIG.sourceCode}/assets/mixins.scss`
                ]
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          include: WEBPACK_COMMON_CONFIG.sourceCode,
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
          include: WEBPACK_COMMON_CONFIG.sourceCode,
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
          test: /\.ejs$/,
          use: [
            {
              loader: 'ejs-loader'
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
  const pages = glob.sync('src/views/**/*.js');
  pages.map((filepath)=>{
    const fileName = path.basename(filepath, '.js');
    const temp = `${WEBPACK_COMMON_CONFIG.sourceCode}/views/${fileName}/${fileName}.html`;
    let conf = {
      chunks: ['manifest', 'common', 'vendors', fileName],
      filename: path.resolve(__dirname, `${WEBPACK_COMMON_CONFIG.assetsViews}/${fileName}.html`),
      template: temp,
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
