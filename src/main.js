import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import directiveObj from '@/utils/directive'

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

// 执行目标对象里的 install 方法并传入 Vue 类
Vue.use(directiveObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 首页 -> 记录滚动位置
// 问题：首页滚动一些，点击“我的”再切回来为何滚动条回到了顶部？
// 疑惑：组件缓存 keep-alive 保存组件标签 + 样式 + js 变量，不会保存滚动位置
// 原因:切换到"我的"页面,页面高度不够高，没有滚动条（此“滚动条是整个网页”的）
// 滚动位置会回到顶部，所以切换回“首页”，只是内容改变了，滚动条还在顶部
// 解决：首页滚动时，实时保存滚动位置，而不是在失去焦点（被切走的时候）保存滚动位置，在它的路由对象 meta 中保存滚动位置
