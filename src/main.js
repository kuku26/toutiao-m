import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载 Vant 核心组件库
import Vant from 'vant'

// 加载 Vant 全局样式
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.less'

// 加载动态设置 REM 基准值
import 'amfe-flexible'

// 加载 Dayjs 初始化配置
import '@/utils/dayjs'

// 注册使用 Vant 组件库
Vue.use(Vant)

// 封装中间件函数插件
const directiveObj = {
  install (Vue) {
    // 自定义全局指令
    Vue.directive('fofo', {
      inserted (el) {
        // 指令所在 van-search 组件中
        // 组件根标签是 div, input 在这个 div 内部
        // 以上都是原生标签对象
        // console.log(el)
        const theInput = el.querySelector('input')

        theInput.focus()
      }
    })
  }
}
// 执行目标对象里的 install 方法并传入 Vue 类
Vue.use(directiveObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
