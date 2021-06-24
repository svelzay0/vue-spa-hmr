**说在前面**:本文主要是提供`webpack4.5`版本的热替换无效的一种解决方案,借助`webpack-dev-server-output插件`,感兴趣的小伙伴可以交流讨论哦.大致效果如下:![HMR.gif](https://upload-images.jianshu.io/upload_images/7859404-90be2c23448a143d.gif?imageMogr2/auto-orient/strip)

----
## 背景
搞前端开发的同学肯定都知道`webpack`吧?连我这菜鸟都知道点呢,你们肯定知道的!大家都知道,`webpack`使用起来很是愉快,几条命令就完成了我们对静态资源的打包(**图片/样式/脚本**等),但是其配置文件却着实令人头痛!而想要在开发中愉快高效地使用`webpack`,就需要对配置文件`webpack.config.js`下些功夫!学习资料包括[webapck官方文档](https://www.webpackjs.com/concepts/)和众多的配置和优化相关的博客,这里就不赘述了!
![webpack](https://upload-images.jianshu.io/upload_images/7859404-b28c6beb3ae540ec.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
而随着`webpack4.x`的发布,配置文件做了优化,变得稍稍简单了一些,这不手贱没忍住,升级了`webpack`到`4.5版本`,于是按照之前的配置有些东西不好使了!
![我能怎么办我也很无奈](https://upload-images.jianshu.io/upload_images/7859404-ebb469f7e6f07ff2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
----
## webpack 4.x

`webpack4.x`将`CLI`抽离出为单独的包`webpack-cli`,需要`npm install webpack-cli -D`**单独全局安装**不然无法进行编译.此外,对配置文件做了一些变动,像是新增的`mode`项(可以配置执行`development`和`production`两种打包模式)等细节不赘述(主要是我也没掌握/捂脸).而我要讲的是我按照官网和众多博客配置的`HMR(Hot Module Replacement)`不起作用,及最后寻得的解决方案!

-----
##热替换(Hot Module Replacement)
所谓热替换,就是在**不刷新网页的情况下,改变代码后,会自动编译并更新页面内容**,是不是很神奇?相比传统的,变更代码后运行`webpack`重新打包,然后`F5`刷新页面,是不是简单了好多?想要了解其原理的同学可以看[这里](https://github.com/liangklfangl/webpack-hmr).而像我这种'懒癌+强迫症'患者,得知有这么个'偷懒的'机会,是一定不会放过的,所以就陷入了不断的挖坑填坑中...无法自拔啊!
## 1. 准备项目
- 项目目录
```
- project 
  - dist
    main-build.js
    main-build.js.map
    index.html
  - src
    - views
      Home.vue
      About.vue
      index.js
    main.js
    route.config.js
  - test
  package.json
  webpack.base.config.js
  webpack.dev.config.js
  webpack.config.js  
```
具体容看[这里]()
## 2. 如何实现?
在开始之前,哪啊不能从源码上理解其运行机制,但是也要对大致的配置及作用有所了解,可以看下这里[webpack develement](https://webpack.js.org/guides/development/).可以了解到实现HMR有几种方式,`webpack's Watch Mode`/`webpack-hot-middleware`+`express`/`webpack-dev-derver`,后两者都需要在配置里面加入`devServer`配置项.下面就是具体试下那步骤进行介绍.
#### 步骤1 安装依赖包
- 假设你已经安装了`node.js`较新的版本(以为`webpack 4.x`对`node`版本进行了限制,保证最新就好了),这样便有了`npm`包管理器
-   全局安装`webpack`最新版本的包和`cli`:` npm install webpack webpack-cli -g`
- 之后本地开发安:`npm install webpack webpack-cli webpack-dev-server --save-dev`
#### 步骤2 配置webpack.config.js文件
考虑到不同打包需求,往往会又多份配置文件,我们暂时配置三个:`base`/`dev`/`build`
- 不同打包模式配置文件的公用部分,`webpack.base.config.js`
```
// 引入node相关模块
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPligin = require("clean-webpack-plugin");

// 设置路径
module.exports = {
  // 打包开始的地方,即从这里开始分析模块和资源依赖
  entry: "./src/route.js",
  // 输出
  output: {
    // 输出路径
    path: path.resolve(__dirname, "./dist"),
    // 输出文件名
    filename: "[name]-build.js"
  },
  module: {
    rules: [
      {
        // 解析.vue文件
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [
    // 每次重新打包时清楚原本的内容
    new CleanWebpackPligin("./dist", {
      exclude: ["index.html"]
    })
  ],
  resolve: {
    // 通过.vue文件进行模板编译时,需要添加此配置
    alias: {
      vue$: "vue/dist/vue.common.js"
    }
  }
};
```
- 开发模式下的配置文件:`webpack.dev.config.js`
```
const webpack = require("webpack");
const WebpackDevServerOutput = require("webpack-dev-server-output");
const baseConfig = require("./webpack.base.config");

// 开发模式
baseConfig.mode = "development";
// 打包文件在内存中的输出路径,可以通过http://localhost:8066/assets/访问
baseConfig.output.publicPath = "/assets/";
// 方便追踪源代码中的错误
baseConfig.devtool = "source-map";
// 服务配置
baseConfig.devServer = {
  // 发布服务的文件夹
  contentBase: "./dist",
  host: "127.0.0.1",
  port: 8066,
  // 声明为热替换
  hot: true,
  // 第一次打包时打开浏览器
  open: true,
  // 与output中的内容保持一致
  publicPath: "/assets/"
};
baseConfig.plugins.push(
  ...[
    new webpack.NamedModulesPlugin(),
    // 热替换插件
    new webpack.HotModuleReplacementPlugin(),
    // 将webpack-dev-server在内存中打包的文件输出为本地文件
    new WebpackDevServerOutput({
      path: "./dist/assets",
      isDel: true
    })
    // ...
  ]
);
module.exports = baseConfig;
```
- 生产模式下的配置文件:`webpack.config.js'
```
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const baseConfig = require("./webpack.base.config");

baseConfig.mode = "production";
baseConfig.plugins.push(
  ...[
    // 压缩代码 生产模式会默认调用改插件
    new UglifyJsPlugin()
    // ...
  ]
);
```
#### 步骤3 添加`scripts`
打开项目的`package.json`文件,找到`scripts`,然后添加如下内容:
```
 "scripts": {
    // 生产模式 默认调用webpack.config.js
    "build": "webpack",
    // 开发模式 指定调用webpack.dev.config.js
    "dev": "webpack-dev-server --config webpack.dev.config.js"
  }
```
这样在命令行输入`npm run dev`便会编译本地文件,并打开浏览器显示出`devServer`中配置的`contentBase`中的内容,默认是其中的`idnex.html`.

#### 结果并不如愿
![image.png](https://upload-images.jianshu.io/upload_images/7859404-65b623d5952ee3e7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
Waht?我明明是按照官方 文档配置的啊?
问题是通过`devServer.publicPath`无法访问到内存中创建的打包文件`main-build.js`!!!
查看了N多博客之后,还是一头雾水,问题没能解决.但是想着,如果把内存中的文件输出到本地,然后发布出来,是不是就可以访问了?
#### 解决方案
于是在npm上搜索到了[webpack-dev-server-output插件](https://www.npmjs.com/package/webpack-dev-server-output),正是我想要的,而且配置也很简单.
- 对配置文件做如下更改:在`webpack.dev.config.js`的`plugins数组`中如下添加插件配置:
```
new WebpackDevServerOutput({
    // 文件输出路径,这里设置为devServer服务路径的子路径
    // 这样就可以通过URL访问到了
    path: "./dist/assets",
    // 重新编译时删除之前你的文件
    // 这里可能会有效率问题
    isDel: true
})
```
- 问题:每次重新更改触发重新编译后,都会将`./assets`下原始的文件删除掉,重新写入,会带来性能的问题
----
写在最后:**热替换最初的目的就是为了减去重复写入文件的麻烦,所以把重新编译的文件放在内存中**,通过URL访问,但是无奈404,只能暂且使用该方法解决,至少现在不用每次更新都输入密令然后F5刷新了.

如果哪位大神有更好的解决办法,还请指点迷津啊!拜托拜托!

----
#### 参考
- [webapck 4.5官方文档](https://www.webpackjs.com/concepts/)
- [HMR原理解析]((https://github.com/liangklfangl/webpack-hmr))
- [为什么要准备三份配置文件](https://zhuanlan.zhihu.com/p/29161762)

----
**如果您感觉有所帮助，或者有问题需要交流，欢迎留言评论，非常感谢！**
**前端菜鸟，还请多多关照！**

- Git： [BuggMaker](https://github.com/BuggMaker)
- 博客：[倒霉蛋儿_才才](https://www.jianshu.com/u/4c79df8e2b03)
----
