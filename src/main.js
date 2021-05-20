import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// 改造之后的element-ui样式
import './styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

// iconfont(自定义)
// import '@/assets/icon/iconfont.js'

import App from './App'
import store from './store'
import router from './router'

// 全局注册filters
import * as filters from './filters' // global filters
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局注册svg-icon
import '@/icons' // icon

// 下面是做权限控制相关的
// import '@/permission' // permission control

// 全局引入echarts并且挂载到vue原型
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts

// set ElementUI lang to zh-CN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

// 自定义全局组件
// import CustomComponents from '@/components/CustomComponents/index'
// // 以插件的方式注册进去
// Vue.use(CustomComponents)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
