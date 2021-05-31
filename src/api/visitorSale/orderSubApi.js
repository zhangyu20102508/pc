import HttpUtil from '@/common/HttpUtil'

const orderSubApi = {
  /**
   * 确认订单获取省城市
   * @param {*} params
   */
  getProvice (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/region/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 游客确认订单
   * @param {*} params
   */
  goToPay (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/orderConfirm'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 获取历史地址信息
   * @param {*} params
   */
  getHistoryAddress (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/list'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 獲取orcle手機號校驗
   * @param {*} params
   */
  getOrclePhone (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/checkMobile'
    return HttpUtil.get(postUrl, params)
  }
}
export default orderSubApi
