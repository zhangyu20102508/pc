import HttpUtil from '@/common/HttpUtil'
const listSaleApi = {
  // 获取分享列表
  list (params) {
    let postUrl =
      process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/search'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  }
}
export default listSaleApi
