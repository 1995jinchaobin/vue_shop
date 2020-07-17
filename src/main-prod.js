import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/base.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'



// 导入NProgress包对应的js和css(页面跳转进度条)
import NProgress from 'nprogress'


// import { padStart } from 'core-js/fn/string'
// 自定义axios基础地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request(请求)拦截器中,展示进度条 NProgress.start()
// 检测是否含有token,没有则返回
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response(响应)拦截器中,隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 全局注册树桩表格
Vue.component('tree-table',TreeTable)
// 全局注册自定义的日期过滤器dataFormat,传参值originVal为毫秒
Vue.filter('dateFormat',function(originVal){
  // 先把传参毫秒转化为new Date()
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // 月份是从0开始,需要+1。  +''是把数字转化为字符串,padStart(2,'0')是把字符串设置为2位数,不足2位则在开头加'0'
  const m = (dt.getMonth()+ 1 + '').padStart(2,'0')
  const d =(dt.getDate() + '').padStart(2,'0')
  const hh =(dt.getHours() + '').padStart(2,'0')
  const mm =(dt.getMinutes() + '').padStart(2,'0')
  const ss =(dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
})
// 全局注册富文本编辑器
Vue.use(VueQuillEditor /*, { default global options } */)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
