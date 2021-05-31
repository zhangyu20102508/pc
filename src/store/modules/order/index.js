
import orderApi from '../../../api/saleSlip/orderApi'
import * as types from '../../mutation-types'

const state = {
  oredrList: {},
  orderDetail: {},
  productinfos: [],
  orderChange: {},
  sightInfo: {}
}
const getters = {
  oredrList: state => state.oredrList,
  orderDetail: state => state.orderDetail,
  productinfos: state => state.productinfos,
  orderChange: state => state.orderChange,
  sightInfo: state => state.sightInfo
}
/**
 * 销售单列表
 */
const actions = {
  getOrderList ({ commit }, params) {
    orderApi.getList(params).then(res => {
      let rec = res.data.body.salesSlips
      commit(types.ORDERLIST, { rec })
    })
  },
  /**
   * 销售单详情
   */
  getOrderDetail ({ commit }, params) {
    // orderApi.getDetailList(params).then(res => {
    let rec = params
    commit(types.ORDERDETAIL, { rec })
    commit(types.PRODUCTINFOS, { rec })
    commit(types.PRODUCTSIGHTINFOS, { rec })
    // })
  },
  getOrderDetails ({ commit }, params) {
    orderApi.getDetailList(params).then(res => {
      let rec = res.data.body.salesSlip
      commit(types.ORDERDETAIL, { rec })
      commit(types.PRODUCTINFOS, { rec })
      commit(types.PRODUCTSIGHTINFOS, { rec })
    })
  },
  /**
   * 订单详情转化
   *
   */
  getChangeOrder ({ commit }, params) {
    orderApi.getdetailChange(params).then(res => {
      let rec = res.data.body.orderPage
      commit(types.ORDERCHANGE, { rec })
    })
  }
}
const mutations = {
  [types.ORDERLIST] (state, { rec }) {
    state.oredrList = rec
  },
  [types.ORDERDETAIL] (state, { rec }) {
    state.orderDetail = rec
  },
  [types.PRODUCTINFOS] (state, { rec }) {
    state.productinfos = rec
  },
  [types.ORDERCHANGE] (state, { rec }) {
    state.orderChange = rec
  },
  [types.PRODUCTSIGHTINFOS] (state, { rec }) {
    let data = rec
    if (rec.headImgUrl === '' || rec.headImgUrl == null) {
      data.picUrl = require('../../../assets/img/default.png')
    } else {
      // data.picUrl = process.env.DOMAIN +
      //   '/api/v1/nuskin/trade/mall' +
      // rec.headImgUrl
      data.picUrl = rec.headImgUrl
    }
    data.name = rec.nickName
    data.date = rec.periodOfValidity
    data.count = rec.count
    state.sightInfo = data
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
