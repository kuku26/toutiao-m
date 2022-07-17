// 请求模块
import axios from 'axios'
import store from '@/store'
// import JSONBig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/'
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
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.log(config)
  // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去
  return config
}, function (error) {
  // 如果请求出错了（还没有发出去）会进入这里
  return Promise.reject(error)
})

// 响应拦截器

export default request
