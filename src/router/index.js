import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
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
    component: () => import(/* webpackChunkName: "Login" */'@/views/login/login.vue'),
    beforEnter (to, from, next) {
      const { user } = store.state
      if (user?.length > 0) {
        // next(false) // 留在原地，什么都不写
        // 想要进登录页不留在原地了，而是返回首页
        next('/')
        // 手机App里没有地址栏，我们是不能破坏跳转的过程的
      } else {
        next() // 其他情况通通放行
      }
    }
  },
  {
    path: '/',
    // name: 'layout', // 既然该父路由设置了默认子路由显示，该 name 没有意义，控制台会报黄色警告
    component: () => import(/* webpackChunkName: "Layout" */'@/views/layout/index.vue'),
    children: [
      {
        path: '', // 空字符串表示默认显示的路径页面的子路由，默认只能有1个
        name: 'home',
        component: () => import(/* webpackChunkName: "Home" */'@/views/home'),
        meta: {
          scrollT: 0 // 保存首页离开时的滚动条位置
        }
      },
      {
        path: '/my', // 空字符串表示默认显示的路径页面
        name: 'my',
        component: () => import(/* webpackChunkName: "My" */'@/views/my')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */'@/views/search/index.vue')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import(/* webpackChunkName: "Article" */'@/views/article'),
    props: true
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import(/* webpackChunkName: "UserProfile" */'@/views/user-profile')
  },
  {
    path: '/ChatRobot',
    name: 'ChatRobot',
    component: () => import(/* webpackChunkName: "ChatRobot" */'@/views/Chart/index.vue')
  }
]
const router = new VueRouter({
  routes
})

// 路由 - 全局前置守卫（在路由发生真正跳转之前，执行此函数）
// 此函数可以决定路由是否跳转/取消/强制中断切换到别的路由
// router.beforeEach((to, from, next) => {
//   // 需求： 如果已经登录了，不要切换到登录页面
//   // ?. 和 && 类似：  a?.b 相当于 a && a.b ? a.b : undefined
//   const { user } = store.state
//   if (user?.length > 0 && to.path === '/login') {
//     next('/layout/home') // 想要进登录页不留在原地了，而是返回首页
//   } else {
//     next() // 其他情况通通放行
//   }
// })

export default router
