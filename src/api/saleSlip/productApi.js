import HttpUtil from '@/common/HttpUtil'
const productApi = {
  // 获取产品配置列表
  productList (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/product/list'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  }
}
export default productApi
