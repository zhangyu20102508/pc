import HttpUtil from '@/common/HttpUtil'
const userapi = {
  login (params) {
    // let postUrl = process.env.DOMAIN + '/user/login '
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/user/login '
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 修改用户昵称
   * @param {*} params
   */
  editName (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/user/updateNickName'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.post(postUrl, params)
  },
  /**
   * 修改用户头像
   * @param {*} params
   */
  editAvatar (params) {
    let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/user/updateHeadImg'
    // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
    return HttpUtil.post(postUrl, params)
  }
}
export default userapi
