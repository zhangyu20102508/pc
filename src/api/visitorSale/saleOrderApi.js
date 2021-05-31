import HttpUtil from '@/common/HttpUtil'
const PaymentApi = {
  /**
   * 游客支付
   * @param {*} params
   */
  payment (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/orderPayment'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.post(postUrl, params)
  }
}
export default PaymentApi
