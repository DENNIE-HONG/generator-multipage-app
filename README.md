
> 生成项目test版
非单页面

## Installation

First, install [Yeoman](http://yeoman.io) and generator-app-demo using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-multipage-app
```

Then generate your new project:

```bash
yo multipage-demo
```

## 页面结构
|--build   webpack配置  
|--config  webpack配置常量  
|--src  源码  
     |--assets  资源文件  
     |--views   页面文件  
     
## 开发环境
模板：ejs  
模板layout组件依赖参数传递  
参数统一在control里配置  
用koa起服务  
devServer代理到koa服务地址  
```
npm run devServer
```

## 生产环境
### 起服务
服务使用koa  
+ 模板配置
+ 路由配置
+ 静态资源
+ 安全头
+ josnp
+ 日志配置
+ 错误处理


```
npm run start
```

### 打包
```
npm run build
```

### 打包后起服务
```
npm run build-start
```


## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [hongluyan]()

