'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config') // 获取配置
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// const createLintingRule = () => ({
//   test: /\.(js|vue)$/,
//   loader: 'eslint-loader',
//   enforce: 'pre',
//   include: [resolve('src'), resolve('test')],
//   options: {
//     formatter: require('eslint-friendly-formatter'),
//     emitWarning: !config.dev.showEslintErrorsInOverlay
//   }
// })

let publicPath = config.dev.assetsPublicPath
if (
  process.env.NODE_ENV === 'prod' ||
  process.env.NODE_ENV === 'stage' ||
  process.env.NODE_ENV === 'qa' ||
  process.env.NODE_ENV === 'test'
) {
  publicPath = config.build.assetsPublicPath
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    // 配置webpack编译入口
    // app: './src/main.js'
    app: ['babel-polyfill', './src/main.js']
  },
  // app: ['./node_modules/babel-polyfill/dist/polyfill.js' , './src/main.js']
  output: {
    // 配置webpack输出路径和命名规则
    path: config.build.assetsRoot, // webpack输出的目标文件夹路径（例如：/dist）
    filename: '[name].js', // webpack输出bundle文件命名格式，基于文件的md5生成Hash名称的script来防止缓存
    publicPath: publicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'], // 自动解析确定的拓展名,使导入模块时不带拓展名
    alias: {
      // 创建import或require的别名，一些常用的，路径长的都可以用别名
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
