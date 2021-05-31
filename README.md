#  前端单页应用工程项目
> A Vue.js project
> 作用：通过这个工程项目文件开始，可以快速开始一个新的前端单页应用。
> 主要技术栈vue-cli,webpack,Element-ui

## 关于安装和本地启动  Build Setup  
``` sh
npm install
# install dependencies
#下载后安装依赖npm install   或   yarn (npm install yarn 安装yarn 锁定项目版安装依赖包的版本号)
npm run dev / npm start  或 yarn run dev yarn start
# 开启本地调试环境,运行这个命令后，就可以通过这个地址访问 localhost:8080   本地启动
```
#  关于部署 build for production with minification

1：服务器部署 路径 /home/dev/nuskintw/nginx-8480/html/nuskin-pc  广州服务器 192.168

2：在当前目录，构件生产环境的文件.会在当前目录下生成目录：dist。可将这个文件夹里的内容放入到线上静态文件服务器上，即可访问。
build 之前记得把之前 build后的 文件全部删除 以免影响
``` sh 
云校&&发布相关
npm run yunxi-twqa  構建qa環境  配置文件是config下的qa.env.js
npm run yunxi-twprod   配置用的是config下的prod.env.js
npm run yunxi-twstage  用的stage.env.js的配置 
npm run yunxi-twtest  用的test.env.js的配置 
```

## 关于环境
- Node.js v9.8.0
- npm     v5.6.0
- webpack-cli 3.11.0 package.json 安装版本为：3.6.0
---

## 关于项目结构及说明

```
.
├── build                                       // webpack配置文件
├── config                                      // 项目配置路径
├── dist                                        // 上线项目文件，放在服务器即可正常访问
├── doc                                         // 项目文档，规范
├── src                                         // 源码目录
│   ├── components                              // 公共组件
│   ├── api                                     // 业务相关的各页面接口
│   ├── assets                                  // 静态资源文件目录
│   │   ├── fonts                               // 字体目录
│   │   ├── img                                 // 静态图片目录
│   │   └── styles                              // 样式目录
│   │       ├── common.less                     // 全局公用样式封装
│   │       └── main.less                       // 全局样式引用
│   ├── common                                  // 公共代码目录
│   ├── router                                  // 路由目录
│   ├── store                                   // vuex仓库目录
│   ├── views                                   // 页面代码目录
│   ├── App.vue                                 // 页面入口文件
│   ├── main.js                                 // 程序入口文件，加载各种公共组件
├── test                                        // 测试目录                              
├── element-variables.scss                      // 编译et i,  et                         
├── index.html                                  // 入口html文件                         
.
```
## 全局公用样式封装调用方式
```css
    .className{
        .cf > .text-overflow();或
        .cf >.text-overflow;
    }
```

    
## 关于命名规范
1. 文件夹名要与小写字母开头式的驼峰
2. 其它文件名要用小写字母开头式的驼峰
3. js类文件要用字母开头式的驼峰
4. vue 文件名要用小写字母开头式的驼峰
---
## 关于API
1. HtppUtil.js 引入axios 和qs封装
2. src/api下定义相关模块API
3. 关联--store ![store](./doc/img/vuex.png)
---
# 关于elementUi
1.  \src\common\element-import.js  进行了 全局引入 不需要 在每个页面中单独引入   如遇到特殊情况特殊对待

## 关于路由
1：动态匹配

2：路由懒加载
    const Login = resolve => require(['@/views/login/Login'], resolve)

3：[vue-router 官方地址](https://router.vuejs.org/zh-cn/advanced/lazy-loading.html)

---

## 关于iconfont

1. 项目中应避免img静态图片的引用，而使用iconfont引入图标，特殊情况除外
2. 在 assets/fonts 中为本地iconfont库，除非新增图标，否则不必修改；
3. 项目中需要的图标均在 assets/styles/base/font.less 中，根据需求找到相应图标class，如user图标的class为 icon-class,
使用方法：<i class="iconfont icon-user"></i>大小（用font-size设置）
4. 若所需图片包含两种或两种以上颜色，使用svg，方法：<svg class="icon" aria-hidden="true"><use xlink:href="#icon-user"></use></svg>，
   svg大小用width设置
5. 图片命名格式统一用 .icon-xxx

---

# 关于全局loading问题
 ## 参照xuyawei分支4.27号 21:12提交
## 关于项目优化  webpack-bundle-analyzer插件  热启动 http://127.0.0.1:8888 端口 观看项目 占比图
### 第一种配置方式

1：package.json script{ } 中配置"analyz":"NODE_ENV=production npm_config_report=true npm run build"

2：然后在webpack.prod.conf.js 中配置
``` bash

    if(true){
        var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        webpackConfig.plugins.push(new BundleAnalyzerPlugin())
    }
```
3: 运行：npm run build

---

### 第二种配置方式
1：直接在package.json script{} 中配置 "analyz":"build for production and view the bundle analyzer report"
2：运行：npm run build --report

以上两种配置在项目中中均有尝试。目前使用第二种配置

---

## 关于构建环境
``` bansh
    在package.json script{} 中配置如下
    "start": "npm run dev",
    "dev": "webpack-dev-server --inline --progress --config  build/webpack.dev.conf.js",
    "build": "node build/build.js",
    "build:prod":"node build/build.js production",
    "build test": "node build/build.js development",
    其中start 和dev 默认为本地
    build[npm run build ]默认构建为测试环境
    build prod[ npm run build prod] 构建为生产(线上)环境
```
 ### build build.js 中修改默认环境变量为
 ``` bash
    // process.env.NODE_ENV = 'production'
    process.env.NODE_ENV = process.argv[2] || 'testing'
    console.log('當前構建環境是：' + process.env.NODE_ENV)
 ```
 ###  build webpack.prod.conf.js 中修改默认变量为
 ``` bash
    // const env = process.env.NODE_ENV === 'testing'
    //   ? require('../config/test.env')
    //   : require('../config/prod.env')

    const env = process.env.NODE_ENV === 'testing' ? require('../config/test.env') : (process.env.NODE_ENV ==='production'
    ? require('../config/prod.env')
    : config.build.env)
    console.log( env );
 ```

## 關於環境外部配置項


### 用generate-asset-webpack-plugin 插件， npm install  generate-asset-webpack-plugin --save-dev
### 在webpack.prod.conf.js中去生成configServer.json文件，让其在build prod 的时候输出：

```bash

const  GenerateAssetPlugin=require('generate-asset-webpack-plugin');
const  createServerConfig=function(compilation){
  //console.log("info from GenerateAssetPlugin:");
  //console.log(compilation);
  let cfgJson={ApiUrl:"192.168.11.90"};
  return JSON.stringify(cfgJson);
}
//在plugins:[]中
new GenerateAssetPlugin({
    filename: 'serverconfig.json',
    fn: (compilation, cb) => {
        cb(null, createServerConfig(compilation));
    },
    extraFiles: []
})
//HttpUtil.JS 文件中使用axios get一下getConfigJson文件
 getConfigJson => {
    axios.get("serverconfig.json").then((result)=>{
        console.log('read from json');
        console.log(result);
    }).catch((error)=>{console.log(error)});
}
入口main.js的时候，调用一下这个getConfigJson()

##关于单测
``` bash
    # build for production and view the bundle analyzer report
    npm run build --report
    # run unit tests
    npm run unit

    # run e2e tests
    npm run e2e

    # run all tests
    npm test
```

##关于自动化测试

1.node环境下，npm 安装selenium webdriver ;
```bash
   npm install selenium-webdrive
```
2.浏览器驱动安装，常用有chromedriver、firefox浏览器驱动等, 这里安装chromedriver,
  下载地址：http://chromedriver.storage.googleapis.com/index.html
  驱动版本需要和浏览器版本匹配，版本匹配参考 :  https://blog.csdn.net/cz9025/article/details/70160273

3.配置chromedriver的系统环境变量：控制面板—系统和安全—系统—高级系统设置—高级—环境变量—
  系统变量—path—编辑—新建—将chromedriver的安装路径加入—确定—配置完成

4.将测试脚本文件放在selenium webdriver 安装完成后生成的node modules 文件夹同一级，
  系统cmd切换到测试脚本（如demo.js，可在项目autoTest文件夹中查看）路径下执行命令：node demo.js，开始测试

拓展：Selenium支持多种语言（Java/ruby/python/C#/Go/JavaScript; python,Java居多，javascript较少），
      Api : http://seleniumhq.github.io/selenium/docs/api/javascript/index.html ,
      相关链接：http://www.cnblogs.com/fnng/category/349036.html

## 使用 `async/await`
使用 `async/await` 需要安装 `babel-plugin-transform-runtime`包，安装完成后，在 `.babelrc` 中添加配置
```
"plugins": [[
    "transform-runtime",
    {
      "helpers": false,
      "polyfill": false,
      "regenerator": true,
      "moduleName": "babel-runtime"
    }
  ]]
```

## 知识点参考

``` bash
    - Element-ui组件 [element-ui](http://element.eleme.io/#/zh-CN/component/installation)
    - vue-router [路由](https://router.vuejs.org/)
    - vuex [状态管理](https://vuex.vuejs.org/)
    - NUXT [SSR](https://nuxtjs.org/guide/vuex-store)

    ---

    - LESS (预编译)(http://www.css88.com/doc/less/features/)
    - [Ant Design Mobile](https://mobile.ant.design/index-cn)
    - [React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)
    - [react-china](http://react-china.org/)
    - [makrdown文档](http://www.appinn.com/markdown/)

```
