'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  DOMAIN: '"http://172.16.19.118:8091"' // 测试环境
})
