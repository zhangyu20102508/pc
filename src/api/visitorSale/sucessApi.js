import HttpUtil from '@/common/HttpUtil'

const sucessApi = {
  /**
   * 游客支付成功
   * @param {*} params
   */
  sucess (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/detail'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  }
}
export default sucessApi
