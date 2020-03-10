/**
 * @file 生产环境起服务
 * @author luyanhong 2018.05
*/
const Koa = require('koa');
const Router = require('koa-router');
const render = require('koa-ejs');
const colors = require('colors');
const serve = require('koa-static2');
const logger = require('koa-logger');
const indexRoute = require('./routes'); //引入路由
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const jsonp = require('koa-jsonp');
const app = new Koa();
const router = new Router();
const log = console.log;
const { WEBPACK_PROD_CONFIG } = require('./config');
require('dnscache')({
  'enable': true
});

//模板设置
render(app, {
  root: WEBPACK_PROD_CONFIG.assetsViews,
  layout: false,
  viewExt: 'html',
  cache: false
});
// Must be used before any router is used
// app.use(render(WEBPACK_PROD_CONFIG.assetsViews), {
//   //不设置的话，模板文件要使用.ejs后缀而不是.html后缀
//   map: { html: 'ejs' }
// });
//路由
indexRoute(router);

app.use(logger())
  .use(serve('/', WEBPACK_PROD_CONFIG.assetsDirectory))
  .use(helmet({
    dnsPrefetchControl: false,
    hsts: false
  }))
  .use(bodyParser())
  .use(jsonp())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(async (ctx, next) => {
    try {
      await next();
      // 处理404
      if (ctx.status === 404) {
        ctx.body = 'Hello 404 error!';
      }
    } catch (err) {
      // 处理500
      ctx.response.status = 500;
      ctx.throw(err);
    }
  });

app.listen(WEBPACK_PROD_CONFIG.port, () =>{
  log(colors.green(`open http://localhost:${WEBPACK_PROD_CONFIG.port}`));
});
//错误处理
app.on('error', (err, ctx) => {
  log(colors.red(err));
});
