'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"qa"',
  // DOMAIN: '"https://nuskin-tw.dtyunxi.cn"' // 外网环境
  DOMAIN: '"https://shoptest.nuskin.com.tw/nuskin-tw-personal-offer-backapp"' // qa环境
})
