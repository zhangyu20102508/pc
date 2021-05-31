import sucessApi from '../../../../api/visitorSale/sucessApi'
import * as TYPES from '../../../mutation-types'

const state = {
  sucessInfo: ''
}

const getters = {
  sucessInfo: state => state.sucessInfo
}

const mutations = {
  [TYPES.ORDERSUCESS] (state, { rec }) {
    state.sucessInfo = rec
  }
}

const actions = {
  /**
   * 游客购买销售单成功
   */
  'sucessInfo': ({ commit }, params) => {
    sucessApi.sucess(params).then(res => {
      let rec = res.data.body.order
      rec.constMoney = rec.orderMain.payAmount
      commit(TYPES.ORDERSUCESS, { rec })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
