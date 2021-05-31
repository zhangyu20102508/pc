/**
 * Created by li.zhixiong on 2018/3/21.
 */
import axios from 'axios'
import stores from '../store/index.js'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    stores.dispatch('showloader')
    if (window.localStorage.token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.auth = `${window.localStorage.token}`
      // alert(window.localStorage.token)
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
const Utils = {
  get (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: data,
          withCredentials: false,
          headers: {'Pragma': 'no-cache'}
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          reject(error)
          console.log(error)
        })
    })
  },
  post (url, data = {}) {
    return new Promise((resolve, reject) => {
      // axios.post(url, qs.stringify(data), {
      axios
        .post(url, data, {
          // withCredentials: true,
          // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          reject(error)
          console.log(error)
        })
    })
  },
  // 在用axios，get一下这个json，build目錄下 webpack.prod.conf.js文件
  getConfigJson () {
    axios
      .get('serverconfig.json')
      .then(result => {
        console.log('read from json')
        console.log(result)
      })
      .catch(error => {
        console.log(error)
      })
  }
}
axios.interceptors.response.use(
  function (response) {
    stores.dispatch('hideloader')
    return response
  },
  function (err) {
    stores.dispatch('hideloader')
    return Promise.reject(err)
  }
)
export default Utils
