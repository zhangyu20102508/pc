import Vue from 'vue'
import { getBrowser } from './base'

/**
 * 判断浏览器类型
*/
const browserType = getBrowser()
let getTime
if (browserType === 'Safari' || /IE/ig.test(browserType)) {
  getTime = function (time) {
    if (/-/.test(time)) {
      time = time.replace(/-/g, '/')
      if (/IE/ig.test(browserType)) {
        return new Date(time.replace(/-/, '/'))
      }
    }
    if (time instanceof Date) {
      return new Date(time)
    }
    if (/[T.]/.test(time)) {
      let yy = time.split('-')[0]
      let MM = time.split('-')[1]
      let dd = time.split('-')[2].split('T')[0]

      let hh = time.split('-')[2].split('T')[1].split(':')[0] - 0 + 8
      if (hh > 24) {
        hh = hh - 24
        dd = dd - 0 + 1
      }
      let ss = time.split('-')[2].split('T')[1].split(':')[1]
      let mm = time.split('-')[2].split('T')[1].split(':')[2].split('.')[0]
      time = yy + '/' + MM + '/' + dd + ' ' + hh + ':' + ss + ':' + mm
      if (/IE/ig.test(browserType)) {
        return new Date(time)
      } else {
        return new Date(Date.parse(time.replace(/-/g, '/')))
      }
    } else {
      return new Date(time)
    }
  }
} else {
  getTime = function (time) {
    return new Date(time)
  }
}
/**
 * 限制字數長度，超出隱藏
 * @param  {Date} value let time [description]
 * @return {[type]}        [description]
 */
Vue.filter('text-limit', (value, idx, boo) => {
  if (!value || value === '') {
    return ''
  }
  const len = value.length
  if (len > idx) {
    let newVal = value.slice(0, idx + 1) + '...'
    return newVal
  }
  return value
})
/**
 * 格式化数字 大额
 * @param  {Date} value let time [description]
 * @return {[type]}        [description]
 */
Vue.filter('number-formater', (value, sign) => {
  if (!value || value === '') {
    return 0
  }
  let num = ''
  if (/\./.test(value)) {
    value = value + ''
    let _val = value.split('.')
    value = _val[0]
    num = _val[1]
  }
  let newVal = ''
  let val = (value + '').replace(/,/g, '')
  if (val.length >= 4) {
    val = val.split('').reverse().join('')
    const arr = val.match(/\d{3}/g)
    const len = arr.length
    let i = 0
    if (val.length % 3 !== 0) {
      const banlance = val.slice(len * 3)
      for (; i < len; i++) {
        newVal += arr[i] + ','
      }
      newVal += banlance
    } else {
      for (; i < len; i++) {
        newVal += arr[i] + ','
      }
      newVal = newVal.substr(0, newVal.length - 1)
    }
    newVal = newVal.split('').reverse().join('')
  } else {
    newVal = val
  }
  if (num) {
    return newVal + '.' + num
  } else {
    return newVal
  }
})
/**
 * 毫秒值 转换成 年月日
 * @param  {Date}   value) { let time [description]
 * @return {[type]}        [description]
 */
Vue.filter('time-formater-no-hour', (value, sign) => {
  if (!value || value === '') {
    return ''
  }
  // 返回处理后的值

  let time = getTime(value)
  let year = time.getFullYear()
  let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
  let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
  let timer = year + '-' + month + '-' + day
  return timer
})
/**
 * 毫秒值 转换成 年月日 时分
 * @param  {Date}   value) {               let time [description]
 * @return {[type]}        [description]
 */
Vue.filter('time-formater-has-hour', (value, sign) => {
  // 返回处理后的值
  let time = getTime(value)
  let year = time.getFullYear()
  let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
  let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
  let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
  let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
  let second = (time.getSeconds() < 10 ? '0' : '') + time.getSeconds()
  if (sign) {
    return year + sign + month + sign + day + ' ' + hour + ':' + minute + ':' + second
  }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
})
Vue.filter('time-formater-trans-hour', (value, sign) => {
  // 返回处理后的值
  let time = getTime(value)
  let year = time.getFullYear()
  let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
  let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
  let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
  let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
  let second = (time.getSeconds() < 10 ? '0' : '') + time.getSeconds()
  if (sign) {
    return hour + ':' + minute + ':' + second + ' ' + month + sign + day + sign + year
  }
  return hour + ':' + minute + ':' + second + ' ' + month + '-' + day + '-' + year
})
Vue.filter('time-formater-no-second', (value) => {
  // 返回处理后的值
  let time = getTime(value)
  let year = time.getFullYear()
  let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
  let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
  let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
  let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
})
/**
 * 毫秒值 转换成 时分秒
 */
Vue.filter('time-formater-only-hour', (value) => {
  let time = getTime(value)
  let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
  let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
  let second = (time.getSeconds() < 10 ? '0' : '') + time.getSeconds()
  return hour + ':' + minute + ':' + second
})
/**
 * 毫秒值 转换成 时分
 */
Vue.filter('time-formater-no-second', (value) => {
  let time = getTime(value)
  let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
  let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
  return hour + ':' + minute
})
/**
 * 月-日-年
 */
Vue.filter('time-formater-only-year', (value, sign) => {
  let time = getTime(value)
  let year = time.getFullYear()
  let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
  let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
  if (sign) {
    return month + sign + day + sign + year
  }
  return month + '-' + day + '-' + year
})
/**
 * 分 转换成 元
 * @param  {String}   value)
 * @return {[String]}        [description]
 */
Vue.filter('fenToYuan', (value) => {
  return (parseFloat(value) / 100).toFixed(2)
})
/**
 * 把单位中文转换成英文
 * @return {[type]} [description]
 */
// 日期单位
Vue.filter('dayUnitEn', (value) => {
  let map = {
    '2': 'Day',
    '0': 'Week',
    '1': 'Month'
  }
  return map[value]
})

Vue.filter('search-target', (value, searchText, textClass) => {
  function replaceReg (reg, str) {
    return str.replace(reg, (m) => {
      return '<span class="' + textClass + '">' + m + '</span>'
    })
  }
  let strRegex = '' + searchText
  let regex = new RegExp(strRegex, 'gi')
  value = replaceReg(regex, value)
  return value
})
