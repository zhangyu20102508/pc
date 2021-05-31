import { USER } from '../../mutation-types'

const state = {
  user: {
    name: window.localStorage.username || '',
    img: window.localStorage.userImg || ''
  }
}
const mutations = {
  [USER] (state, user) {
    state.user = user
  }
}
export default {
  state,
  mutations
}
