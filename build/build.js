'use strict'
require('./check-versions')() // 检查 Node 和 npm 版本

// require('shelljs/global')  // 使用了 shelljs 插件，可以让我们在 node 环境的 js 中使用 shell

// process.env.NODE_ENV = 'production'
process.env.NODE_ENV = process.argv[2] || 'testing'
console.log('當前構建環境是：' + process.env.NODE_ENV)

const ora = require('ora') // 一个很好看的 loading 插件
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack') // 加载 webpack
const config = require('../config') // 加载 config.js
const webpackConfig = require('./webpack.prod.conf') // 加载 webpack.prod.conf

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
