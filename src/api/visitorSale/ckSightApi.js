import HttpUtil from '@/common/HttpUtil'

const ckSightApi = {
  /**
   * 游客查看订单详情
   * @param {*} params
   */
  sightCheck (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/detail'
    return HttpUtil.get(postUrl, params)
  },
  /**
   * 游客查看订单产品信息
   * @param {*} params
   */
  projectMessage (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/packageInfo'
    return HttpUtil.get(postUrl, params)
  }
}
export default ckSightApi
