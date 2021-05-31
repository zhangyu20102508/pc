import HttpUtil from '@/common/HttpUtil'

const addSaleApi = {
  // 获取产品信息列表
  getProductList (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/product/list'
    return HttpUtil.get(postUrl, params)
  },
  // 获取类目
  getProductCatgory () {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/product/productCatgory'
    return HttpUtil.get(postUrl)
  },
  // 新增销售单
  addSaleSlip (pramas) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/add'
    return HttpUtil.post(postUrl, pramas)
  },
  // 配置产品
  configSaleSlip (pramas) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/productConfig'
    return HttpUtil.post(postUrl, pramas)
  },
  // 查看销售单详情
  check (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/salesSlip/detail'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.get(postUrl, params)
  }
}
export default addSaleApi
