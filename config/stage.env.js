'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"stage"',
  // DOMAIN: '"https://nuskin-tw.dtyunxi.cn"' // 外网环境
  DOMAIN:
    '"https://psofferstage.nuskin.com.tw/nuskin-tw-personal-offer-backapp"' // qa环境
})
