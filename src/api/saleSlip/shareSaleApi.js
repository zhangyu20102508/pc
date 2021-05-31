import HttpUtil from '@/common/HttpUtil'
const shareSaleApi = {
  // 获取分享成功页面数据
  share (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/detail'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  }
}
export default shareSaleApi
