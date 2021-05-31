import ckSightApi from '../../../../api/visitorSale/ckSightApi'
import * as types from '../../../mutation-types'
import imgHttp from '../../../../common/imghttp'
const state = {
  checkSight: {},
  productMsg: {}
}
const getters = {
  checkSight: state => state.checkSight,
  productMsg: state => state.productMsg
}
/**
 * 游客购买产品
 */
const actions = {
  getPurchaseProducts ({ commit }, params) {
    ckSightApi.sightCheck(params).then(res => {
      let rec = res.data.body.order
      if (rec.orderMain.status === 0) {
        rec.orderMain.status = '預處理'
      } else if (rec.orderMain.status === 1) {
        rec.orderMain.status = '代付款'
      } else if (rec.orderMain.status === 2) {
        rec.orderMain.status = '已付款'
      } else if (rec.orderMain.status === 3) {
        rec.orderMain.status = '已客審'
      } else if (rec.orderMain.status === 31) {
        rec.orderMain.status = '已財審'
      } else if (rec.orderMain.status === 4) {
        rec.orderMain.status = '發貨中'
      } else if (rec.orderMain.status === 41) {
        rec.orderMain.status = '已發貨'
      } else if (rec.orderMain.status === 5) {
        rec.orderMain.status = '已收貨'
      } else if (rec.orderMain.status === 6) {
        rec.orderMain.status = '完成'
      } else if (rec.orderMain.status === 9) {
        rec.orderMain.status = '取消'
      } else if (rec.orderMain.status === 91) {
        rec.orderMain.status = '終止'
      }
      rec.orderItems.map((products, index) => {
        products.imgUrl = imgHttp + products.imgUrl
      })
      // rec.orderMain.orderNo = rec.orderMain.orderNo.replace(/TW/g, 'TW  ')
      if (/saleCheckSight/g.test(window.location.href)) {
        rec.delivery.deliveryName =
          rec.delivery.deliveryName.substr(0, 1) +
          '*' +
          rec.delivery.deliveryName.substr(2)
        rec.delivery.addressDetail =
          rec.delivery.addressDetail.substr(0, 10) +
          rec.delivery.addressDetail.substr(11).replace(/\S/g, '*')
      }
      commit(types.CHECKSIGHT, { rec })
    })
  },
  /**
   * 游客订单详情
   */
  getProjectMessage ({ commit }, params) {
    ckSightApi.projectMessage(params).then(res => {
      let rec = res.data.body
      commit(types.PRODUCTMSG, { rec })
    })
  }
}
const mutations = {
  [types.CHECKSIGHT] (state, { rec }) {
    rec.constMoney = rec.orderMain.payAmount
    state.checkSight = rec
  },
  [types.PRODUCTMSG] (state, { rec }) {
    state.productMsg = rec
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
