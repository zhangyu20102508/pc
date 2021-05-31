import Vue from 'vue'
import Vuex from 'vuex'
import order from './modules/order/index'
import ckSight from './modules/visitorSale/ckSight/index'
import orderSucess from './modules/visitorSale/orderSucess/index'
// import check from "./modules/check/index"
// import product from "./modules/product/index"

import loading from './loadingStor/index.js'
import user from './modules/user/index'

Vue.use(Vuex)

// const debug =process.env.NOOE_ENV !== 'production'
export default new Vuex.Store({
  modules: {
    ckSight,
    order,
    orderSucess,
    // check,
    // product
    user,
    loading
  },
  strict: false
})
