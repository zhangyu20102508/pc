import { SHOWLOADING, HIDELOADING } from './type'

const state = {
  showLoading: false
}

const mutations = {
  [SHOWLOADING] (state) {
    state.showLoading = true
  },
  [HIDELOADING] (state) {
    state.showLoading = false
  }
}
const actions = {
  showloader: ({ commit }) => {
    commit(SHOWLOADING)
  },
  hideloader: ({ commit }) => {
    commit(HIDELOADING)
  }
}
const getters = {
  showLoading (state) {
    return state.showLoading
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
