/**
 * author:lzx
 * time:20180221
 */
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 直销商列表-新增-重新编辑-查看-分享等
const Login = resolve => require(['@/views/login/Login'], resolve) // 登录
const userIndex = resolve => require(['@/components/UserIndex'], resolve) // 不包含头尾
const vistorBox = resolve => require(['@/components/vistorBox'], resolve) // 不包含头尾
const order = resolve => require(['@/views/saleSlip/order'], resolve) // 登陆后首页
const leaveMessage = resolve => require(['@/views/saleSlip/leaveMessage'], resolve) // 留言
const productRankings = resolve => require(['@/views/saleSlip/productRankings'], resolve) // 留言
const saleList = resolve => require(['@/views/saleSlip/saleList'], resolve) // 产看全部分享
const checkSale = resolve => require(['@/views/saleSlip/checkSale'], resolve) // 查看详情
const addSale = resolve => require(['@/views/saleSlip/addSale'], resolve) // 新增分享
const againAdd = resolve => require(['@/views/saleSlip/againAdd'], resolve) // 重新编辑分享
const shareSale = resolve => require(['@/views/saleSlip/shareSale'], resolve) // 创建成功
// 游客查看分享--购买。。。
const saleOrder = resolve => require(['@/views/visitorSale/saleOrder'], resolve) // 訂單支付
const orderSucess = resolve =>
  require(['@/views/visitorSale/orderSucess'], resolve) // 訂單支付成功
const checkSight = resolve =>
  require(['@/views/visitorSale/checkSight'], resolve) // 遊客分享詳情
const orderSub = resolve => require(['@/views/visitorSale/index'], resolve) // 確認訂單信息
const visitorSale = resolve =>
  require(['@/views/visitorSale/visitorSale'], resolve) // 遊客查看分享

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: 'login',
      component: Login
    },
    {
      path: '/vistorBox',
      name: '登陆后主页模板',
      component: vistorBox,
      children: [
        {
          path: '/visitorSale',
          name: '消費者查看分享',
          component: visitorSale
        },
        {
          path: '/orderSub',
          name: '確認訂單',
          component: orderSub
        },
        {
          path: '/saleOrder',
          name: '分享订单支付',
          component: saleOrder
        },
        {
          path: '/orderSucess',
          name: '销售订单支付成功',
          component: orderSucess
        },
        {
          path: '/checkSight',
          name: '消費者查看订单详情',
          component: checkSight
        }
      ]
    },
    {
      path: '/userIndex',
      name: 'userIndex',
      component: userIndex,
      children: [
        {
          path: '/order',
          name: '分享首頁',
          component: order
        },
        {
          path: '/leaveMessage',
          name: '留言',
          component: leaveMessage
        },
        {
          path: '/saleCheckSight',
          name: '詳情',
          component: checkSight
        },
        {
          path: '/productRankings',
          name: '產品銷售排行',
          component: productRankings
        },
        {
          path: '/saleList',
          name: '我的分享',
          component: saleList
        },
        {
          path: '/checkSale',
          name: '分享詳情',
          component: checkSale
        },
        {
          path: '/addSale',
          name: '新增分享',
          component: addSale
        },
        {
          path: '/againAdd',
          name: '编辑分享',
          component: againAdd
        },
        {
          path: '/shareSale',
          name: '分享',
          component: shareSale
        }
      ]
    }
  ]
})
// 页面刷新时，重新赋值token
// if (window.localStorage.getItem('token')) {
//     store.commit(types.LOGIN, window.localStorage.getItem('token'))
// }
