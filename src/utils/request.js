// 请求模块
import axios from 'axios'
// import store from '@/store'
import { Notify } from 'vant'
import router from '@/router'
import { getItem, setItem, removeItem } from '@/utils/storage'
import { getNewTokenAPI } from '@/api/user'

// import JSONBig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/',
  timeout: 2000 // 请求20秒无响应直接判定超时
  // transformRequest: [function (data) {
  //   // Do whatever you want to transform the data
  //   try {
  //     return JSONBig.parse(data)
  //   } catch (err) {
  //     return data
  //   }
  // }]
})
// const jsonStr = '{ "art_id": 1245953273786007552 }'
// {art_id: 1245953273786007600}

// JSONBig 可以处理数据中心超出 JavaScript 安全证书范围的问题
// console.log(JSONBig.parse(jsonStr)) // 把 JSON 格式的字符串转为 JavaScript
// console.log(JSON.parse(jsonStr)) // {art_id: 1245953273786007600}

// 使用的时候需要把 BigNumber 类型的数据转为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString()) // 1245953273786007552  不是数字，是字符串

// console.log(JSON.stringify(JSONBig.parse(jsonStr))) // {"art_id":1245953273786007600}

// console.log(JSONBig.stringify(JSONBig.parse(jsonStr))) // 把 JavaScript 对象 转为 JSON 格式的字符串转成 JS 字符串

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 请求发起会经过该拦截器
  // config：本次请求的请求配置对象
  if (getItem('TOUTIAO_USER')?.length && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getItem('TOUTIAO_USER')}`
  }
  // console.log(config)
  // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去
  return config
}, function (error) {
  // 如果请求出错了（还没有发出去）会进入这里
  return Promise.reject(error)
})

// 响应拦截器
// 本质就是一个函数
request.interceptors.response.use(function (response) {
  // http 响应状态码为2XX，3XX就进入这里
  // 对响应数据做点什么
  return response
}, async function (error) {
  // http 相应状态码4XX, 5XX报错进入这里
  // 对响应数据做点什么
  console.dir(error)
  // 只有401才代表身份过期，才需要跳转登录
  if (error.response.status === 401) {
    // 不能使用 this.$router (因为 this 不是 vue 组件对象无法调用 $router)
    // 解决： this.$router 为了拿到 router 路由对象，所以直接去上面引入 @/router 下 router 对象
    // Notify({ type: 'warning', message: '身份已过期' })

    removeItem() // 先清除 token，才能让路有守卫判断失效，放行我去登录页
    // 方式1：强制用户跳转到登录页面，用户有感知
    // router.replace('/login')

    // 方式2：使用 refresh_token 换回新的 token 再继续使用，JS代码实现，用户无感知（效果好）
    const res = await getNewTokenAPI()

    // 新的 token(也就是 refresh_token换回来的)回来之后，我们要做什么？
    // 1、更新token在本地
    setItem('TOUTIAO_USER', res.data.data.token)
    // 2、更新新的 token 在请求头里
    error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // 3、未完成这次请求，再一次发起
    // error.config 就是上一次请求的配置对象
    // 结果我们要 return 回原本逻辑页面调用的地方 - 还是 return 回去一个 Promise 对象
    return request(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    // 刷新的 refresh_token 也过期了
    localStorage.clear() // 清除localStorage 里所有的值
    Notify({ type: 'warning', message: '身份已过期' })
    router.replace('/login')
  }

  return Promise.reject(error)
})

// 目标： token 讲解
// 操作
// 1、手动修改 localStorage 里的 TOUTIAO_USER 的 token 改错（模拟过期）
// 2、点击反馈/其他需要表明身份的接口（错误 token 写到给后台请求）
// 3、点击关注，这次请求返回状态为 401，进入错误响应拦截器

// 代码解决 401 问题
// 方式1: 清除 token，强制跳转回登录页面，有感知重新登录，拿到新 token替换到本地
// 需要重新点击登录反馈不好
// 方式2：刷新 token, 使用登录时保存的 refresh_token，调用另外一个刷新用户token的接口，换回来
// 新的 token 值，替换到本地，再次完成本次未完成的请求 -> 用户无感知体验好
// 1、登录页面，localStorage.setItem('refresh_token'，存入 refresh_token)
// 2、401中，注释掉跳转 login 代码，引入刷新 token 的 api 方法调用
// 3、替换保存到本地新的 token
// 4、error 错误对象里 headers 替换成新的 token
// 5、axios 再次发起这次未完成请求，返回 Promise 对象到最开始发请求的逻辑页面

export default request
