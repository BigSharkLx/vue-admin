import moment from 'moment'
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
// 传入时间距离现在多久
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
// 通用处理时间方法
// options true代表转换成时间需要乘以1000把秒转换成毫秒;
// type true代表转换成年月日不包含时分秒
export function formatMoment(time, options, type) {
  if (!time) {
    return ''
  }
  if (options) {
    time = time * 1000
  }
  if (type) {
    if (isNaN(Number(time))) {
      return moment(time).format('YYYY-MM-DD')
    } else {
      return moment(+time).format('YYYY-MM-DD')
    }
  } else {
    if (isNaN(Number(time))) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    } else {
      return moment(+time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xdc00 && code <= 0xdfff) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
// 深克隆
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @returns {string}
 */
// 生成随机字符串32位
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

// 控制树层级去掉空的子级 k代表控制展示几层
export function handleTreeData(treeData, k = -1) {
  if (!treeData || !Array.isArray(treeData)) {
    return []
  }
  treeData.forEach(item => {
    if (item.children) {
      if (!item.children.length || k === 0) {
        delete item.children
      } else {
        handleTreeData(item.children, k - 1)
      }
    }
  })
  return treeData
}
// 防抖
export function debouncePerson(fn, delay = 500) {
  let timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
// 节流
export function throttle(fn, delay = 500) {
  let timer
  return function() {
    const context = this
    const args = arguments
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(context, args)
      }, delay)
    }
  }
}
// 计算两个日期相差几天
export function diffDays(startTime, endTime) {
  return moment(endTime).diff(moment(startTime), 'days')
}
// 获取所有的路由路径
export function findAllRoutes(allRoute, prePath = '', result = []) {
  for (let i = 0; i < allRoute.length; i++) {
    const path = allRoute[i].path.includes('/')
      ? prePath + allRoute[i].path
      : prePath + '/' + allRoute[i].path
    result.push(path)
    if (allRoute[i].children) {
      findAllRoutes(allRoute[i].children, path, result)
    }
  }
  return result
}

// 获取当天的23时59分59秒
export function getEndOfDay() {
  return moment()
    .endOf('day')
    .valueOf()
}
// 获取当天的0时0分0秒
export function getstartOfSomeDay(val) {
  return moment(+val)
    .startOf('day')
    .valueOf()
}

// 时间戳转日期（年月日时分）
export const transTimestampToFormatMinute = time => {
  if (time) {
    return moment(time).format('YYYY-MM-DD HH:mm')
  } else {
    return ''
  }
}
// 时间戳转日期（年月日）
export const transTimestampToFormatDate = time => {
  if (time) {
    return moment(time).format('YYYY-MM-DD')
  } else {
    return ''
  }
}

// 金额千分（保留两位小数）
export const transferNumToFixed = val => {
  return !isNaN(+val) && val !== null
    ? (+val).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    : ''
}

// 添加 %
export const addPercent = val => {
  if (val || val === 0) {
    return val + '%'
  } else {
    return ''
  }
}
// 通用组件判断表单是否为空
export function validateFormData(data) {
  for (const k in data) {
    if (
      k !== 'size' &&
      k !== 'page' &&
      (data[k] === '' || (Array.isArray(data[k]) && !data[k].length))
    ) {
      delete data[k]
    }
  }
  return data
}

// 数字前面补0
export function polishingStr(value, digit = 6, str = '0') {
  return (value + '').padStart(digit, str)
}

/*
 * 判断obj是否为一个整数
 */
export function isInteger(obj) {
  return Math.floor(obj) === obj
}
/*
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *   {times:100, num: 314}
 */
export function toInteger(floatNum) {
  var ret = { times: 1, num: 0 }
  if (isInteger(floatNum)) {
    ret.num = floatNum
    return ret
  }
  var strfi = floatNum + ''
  var dotPos = strfi.indexOf('.')
  var len = strfi.substr(dotPos + 1).length
  var times = Math.pow(10, len)
  var intNum = parseInt(floatNum * times + 0.5, 10)
  ret.times = times
  ret.num = intNum
  return ret
}
/*
 * 核心方法，实现加减乘除运算，确保不丢失精度
 * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
 *
 * @param a {number} 运算数1
 * @param b {number} 运算数2
 * @param op {string} 运算类型，有加减乘除（add/sub/mul/div）
 *
 */
// 解决js精度问题
export function operation(a, b, op) {
  var o1 = toInteger(a)
  var o2 = toInteger(b)
  var n1 = o1.num
  var n2 = o2.num
  var t1 = o1.times
  var t2 = o2.times
  var max = t1 > t2 ? t1 : t2
  var result = null
  switch (op) {
    case 'add':
      if (t1 === t2) {
        // 两个小数位数相同
        result = n1 + n2
      } else if (t1 > t2) {
        // o1 小数位 大于 o2
        result = n1 + n2 * (t1 / t2)
      } else {
        // o1 小数位 小于 o2
        result = n1 * (t2 / t1) + n2
      }
      return result / max
    case 'sub':
      if (t1 === t2) {
        result = n1 - n2
      } else if (t1 > t2) {
        result = n1 - n2 * (t1 / t2)
      } else {
        result = n1 * (t2 / t1) - n2
      }
      return result / max
    case 'mul':
      result = (n1 * n2) / (t1 * t2)
      return result
    case 'div':
      result = (n1 / n2) * (t2 / t1)
      return result
  }
}
