'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // DOMAIN: '"https://nuskin-tw.dtyunxi.cn"' // 测试环境
  DOMAIN: '"http://172.16.19.118:8091"' // 测试环境
  // DOMAIN: '"https://psoffertest.nuskin.com.tw/nuskin-tw-personal-offer-backapp"' // qa环境
})
