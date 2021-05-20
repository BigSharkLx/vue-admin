// export class  调用的时候new出一个实例对象 引用方法
import request from '@/utils/request'
// 忘记密码模块
export default class ForgetPwdApi {
  resetPwd(data) {
    return request({
      method: 'post',
      url: '/auth/forget',
      data
    })
  }
}
