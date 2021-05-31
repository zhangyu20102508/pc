import HttpUtil from '@/common/HttpUtil'

const orderApi = {
  /**
   * 销售单列表
   * @param {*} params
   */
  getList (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/get'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 統計分享打開次數
   * @param {*} params
   */
  getShareOpenTime (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/share/open'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 最近销售单
   * @param {*} params
   */
  latestSaleList (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/user/info'
    // let postUrl = process.env.DOMAIN + '/user/info'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 销售单详情
   * @param {} params
   */
  getDetailList (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/detail'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 分享
   * @param {} params
   */
  shareSale (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/share'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 用户购买产品
   * @param {} params
   */
  purchaseProducts (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/purchase'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 转化订单
   * @param {*} params
   */
  getdetailChange (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/successfulOrderDetail'
    return HttpUtil.get(postUrl, params)
  }

}
export default orderApi
