import HttpUtil from '@/common/HttpUtil'
// 获取留言详情
const getLeaveMessage = function (params) {
  let postUrl = process.env.DOMAIN + '/api/v1/nuskin/trade/mall/comment/getlist'
  // let postUrl = Config.mock ? 'static/mock/login.json' : process.env.DOMAIN + '/bshop/login'
  return HttpUtil.get(postUrl, params)
}

export default getLeaveMessage
