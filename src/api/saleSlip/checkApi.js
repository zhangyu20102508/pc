import HttpUtil from '@/common/HttpUtil'

const checkApi = {
  // 查看销售单详情
  check (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/detail'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  },
  // 查看销售单详情 转化订单
  transformOrder (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/order/successfulOrderDetail'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  }
}
export default checkApi
