/**
 * @file 路由配置
 * @author hongluyan
 */
const homeRoute = require('./home');
const route = (router) => {
  homeRoute(router);
};
module.exports = route;
