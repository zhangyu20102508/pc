// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueClipboard from 'vue-clipboard2'
/**
 * 依赖加载
 */
import './common/element-import'
import '../theme/index.css'
import lang from 'element-ui/lib/locale/lang/zh-TW'
import locale from 'element-ui/lib/locale'
import HttpUtil from '@/common/HttpUtil'
import 'babel-polyfill'
require('@/assets/fonts/iconfont')
require('./common/filters')

Vue.use(VueClipboard)
// 语言设置
locale.use(lang)

/**
 * 全局引入
 */
// import ElementUI from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/zh-TW'
// Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

/**
 * 路由动态title
 */
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  document.title = to.name

  // 未登录状态 直接通过url进入需要登录后才能查看的页面 跳转到登录
  if (
    (to.path === '/order' ||
      to.path === '/saleList' ||
      to.path === '/checkSale' ||
      to.path === '/addSale' ||
      to.path === '/againAdd' ||
      to.path === '/shareSale') &&
    !localStorage.token
  ) {
    /* 暂存第一次进入的url 登录之后 跳转之前的链接 */
    window.sessionStorage.setItem('loginToUrl', window.location.href)
    if (to.path === '/brower') {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
  // next()
})
// 調用HttpUtil.js getConfigJson
if (process.env.NODE_ENV === 'production') {
  HttpUtil.getConfigJson()
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
