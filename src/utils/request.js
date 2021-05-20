import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getUserInfo } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})
const ERRMSG_DURATION_TIME = 3000

// request interceptor
service.interceptors.request.use(
  config => {
    // 配置请求头
    config.headers['token'] = getUserInfo('token')
    config.headers['userId'] = getUserInfo('userId')
    config.headers['currentProject'] = getUserInfo(
      'currentProject'
    )?.projectName
    // config.headers['token'] = '8ae53c31-794a-42f7-82c6-795c3e1a5836'
    // config.headers['userId'] = 173
    // config.headers['currentProject'] = 'test12'
    // config.headers['userId'] = 87
    config.headers['productName'] = 'cdp'
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 错误处理具体逻辑
const errHandleFun = res => {
  return new Promise((resolve, reject) => {
    Message({
      message: res.message || '请求错误！',
      type: 'error',
      duration: ERRMSG_DURATION_TIME
    })
    setTimeout(() => {
      resolve()
    }, ERRMSG_DURATION_TIME)
  })
}
const errHandleToLoginFun = res => {
  return new Promise((resolve, reject) => {
    Message({
      message: '登录失效，请重新登录！',
      type: 'error',
      duration: ERRMSG_DURATION_TIME
    })
    setTimeout(() => {
      store.dispatch('user/resetUserInfo')
    }, ERRMSG_DURATION_TIME)
  })
}
// 错误处理报错防抖
const debounce = fn => {
  let flag = true
  return async function(...args) {
    if (!flag) return
    flag = false
    await fn.apply(this, args)
    flag = true
  }
}
const debounceFun = debounce(errHandleFun)
const debounceToLoginFun = debounce(errHandleToLoginFun)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async res => {
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      await debounceFun(res)
      return Promise.reject(new Error(res.message || 'Error'))

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    } else {
      if (res.data.status === 2) {
        await debounceToLoginFun(res.data.message)
      } else if (res.data.status === undefined) {
        return res.data
      } else if (res.data.status !== 0) {
        await debounceFun(res.data)
        return Promise.reject(new Error(res.data.message || 'Error'))
      } else {
        return res.data
      }
    }
  },
  async error => {
    if (error.status === 401) {
      // to re-login
      await debounceToLoginFun(error.message)
    }
    return Promise.reject(new Error(error.message || 'Error'))
  }
)

export default service
