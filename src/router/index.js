import Vue from 'vue'
import VueRouter from 'vue-router'
// 总结：
// 路由懒加载：为了让第一个页面，加载的 app.js 小一点，打开网页快一点
// 思路：把组件对应的 js 分成若干个 .js 文件，。路由切换到哪个页面，才去加载对应的 .js 文件
// 原因：webpack 分析入口时，发现 router 里面上来就 import 所有页面，所以直接打包进 app.js（所以 app.js 很大）
// 解决：当路由路径匹配规则时，才现去 import 引入对应的组件

Vue.use(VueRouter)
// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/',
    // name: 'layout', // 既然该父路由设置了默认子路由显示，该 name 没有意义，控制台会报黄色警告
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '', // 空字符串表示默认显示的路径页面的子路由，默认只能有1个
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/my', // 空字符串表示默认显示的路径页面
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    component: () => import('@/views/search/index.vue')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/ChatRobot',
    component: () => import('@/views/Chart/index.vue')
  }
]
const router = new VueRouter({
  routes
})

export default router
