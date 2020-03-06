/**
 * @file webpakc公共配置信息
 * @author luyanhong
 */
const path = require('path');
const resolve = (dir) => {
  return path.resolve(__dirname, '..', dir); // 函数处理路径拼接
};

//webpack common 配置
const WEBPACK_COMMON_CONFIG = {
  sourceCode: resolve('src'),
  assetsDirectory: resolve('dist'),// 资源路径
  projectRoot: resolve('/'),
  assetsViews: resolve('dist/views'), //页面模板
};
// webpack 开发环境配置
const WEBPACK_DEV_CONFIG = {
  port: 2222, //端口号
  assetsPublicPath: '/', // 编译发布的根目录
  assetsDirectory: resolve('dist'),//资源路径
};
// webpack 生产环境配置
const WEBPACK_PROD_CONFIG = {
  assetsPublicPath: '/',
  assetsDirectory: resolve('dist'),//资源路径,
  assetsViews: resolve('dist/views'),
  port: 2222
};


module.exports = {
  WEBPACK_COMMON_CONFIG,
  WEBPACK_DEV_CONFIG,
  WEBPACK_PROD_CONFIG
};
