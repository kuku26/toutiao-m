import '@/utils/console' // 去掉打印语句
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

// 打包后的产物介绍：
// 名字对应 .vue 中 js 和 css 代表，懒加载所以分散打包
// js 中有 .map 文件：记录了我们打包之前代码的行数和列数
// 原因: 线上环境报错,因为运行的 js 压缩成了1行，报错全在第一行
// 无法寻找代码打包之前的位置，无法定位代码错误的行数
// .map 文件作用：辅助我们查找代码报错的行数和列数（也叫灵魂地图）

// 打包后的跨域问题
// 情况1：后端直接开启了 cors (黑马头条就是这样)
// 开发环境、生产环境（以后部署），都可以直接访问接口，无需考虑跨域问题
// 隐患:后端接口暴露了,任何人都能找到直接请求(有风险)
// 解决:需要登录 + token 调用接口

// 情况2:后端不开启 cors （网易云音乐/网易新闻/以后我公司后台接口）
// 开发环境： webpack开发服务器做，代理转发(yarn serve)
// 开发环境： nodejs + express 在本地搭建一个服务器，代理转发
// 生产环境(yarn build)打包 dist 文件，和 webpack开发服务器环境，无任何关系了，没有人给你转发了
// 解决方案1：把你自己搭建的 nodejs + webpack 在本地搭建的代理服务器和 dist 一起部署到一个云服务器上
// 前端 dist -> nodejs + express 服务器地址(http-server) -> 请求真正的后台接口
// 解决方案2： dist 和你公司的后台接口服务，直接放在一个云服务器上（比米娜跨域访问）
