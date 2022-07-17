import dayjs from 'dayjs'
import Vue from 'vue'
import relativeTime from 'dayjs/plugin/relativeTime'
// 加载中文语言包
import 'dayjs/locale/zh-cn'
// dayjs 默认是英文，需要配置为中文
dayjs.locale('zh-cn') // 全局使用
// dayjs().format()
// 默认返回的是 ISO8601 格式字符串 '2020-04-02T08:02:17-05:00'

// console.log(dayjs().format('YYYY-MM-DD HH:mm:ss dddd'))

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)
// console.log(dayjs().from(dayjs('2021-06-20')))
// 定义一个全局过滤器名叫 relativeTime，用于任何组件的模板中
Vue.filter('relativeTime', value => {
  return dayjs().from(dayjs('2022-06-20'))
})
