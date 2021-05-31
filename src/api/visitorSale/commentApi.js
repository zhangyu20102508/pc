import HttpUtil from '@/common/HttpUtil'
const commentApi = {
  /**
   * 游客销售单售罄添加留言
   * @param {*} params
   */
  submitComment (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/comment/add'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.post(postUrl, params)
  }
}
export default commentApi
