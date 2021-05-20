// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/*
 *
 *seconds  秒数
 */
// 传入时间戳计算时分秒
export function timeResolution(seconds) {
  var day = Math.floor(seconds / (24 * 3600))
  var hour = Math.floor((seconds - day * 24 * 3600) / 3600)
  var minutes = Math.floor((seconds - day * 24 * 3600 - hour * 3600) / 60)
  var second = Math.floor(seconds % 60)
  let result = ''
  if (day > 0) {
    result += day + '天'
  }
  if (hour > 0) {
    result += hour + '小时'
  } else if (hour === 0) {
    result = result ? result + hour + '小时' : ''
  }
  if (minutes > 0) {
    result += minutes + '分'
  } else if (minutes === 0) {
    result = result ? (result + minutes + '分') : ''
  }
  if (second >= 0) {
    result += second + '秒'
  }
  return result
}

// 小数转成百分比
export function transformDecimaltoPercent(val) {
  return (+val * 100).toFixed(2)
}
