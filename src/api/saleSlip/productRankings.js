import HttpUtil from '@/common/HttpUtil'
// 获取本月与上月对比
const getProductRankings = function (params) {
  let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/topProduct'
  // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
  return HttpUtil.get(postUrl, params)
}

export default getProductRankings
