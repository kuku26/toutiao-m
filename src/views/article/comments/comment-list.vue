<template>
  <!-- 只有 list 在可视范围内才会检查滚动位置触发 onLoad 事件 -->
  <!-- immediate-check 是否在初始化时立即执行滚动位置检查 -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="已显示全部评论"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
  >
    <CommentItem
      v-for="(comment, index) in list"
      :key="index"
      :comment="comment"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>
<script>
import { getComments } from '@/api/comment.js'
import CommentItem from './comment-item.vue'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a' // 默认评论类型是 a ，a-对文章(article)的评论
    }
  },
  data () {
    return {
      // list: [], // 存储评论数组
      loading: false,
      finished: false,
      offset: null, // 获取下一页评论的标记（类似时间戳）
      limit: 10,
      error: false
    }
  },
  created () {
    // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading 加载效果,所以我们要手动开启初始 loading 加载效果
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        // 获取文章的评论和获取评论的回复是同一个接口
        // 唯一的区别是接口参数不一样
        //   type:
        //        a-文章的评论
        //        c-评论的回复
        //   source：
        //        文章的评论，则传递文章的 ID
        //        评论的回复，则传递评论的 ID

        // 1、请求获取数据
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log(data)
        // 2、将数据铺设到页面，添加到列表中
        const { results } = data.data
        //    将 data.data.total_count传给父组件更新底部总评论数(也可以直接传 data.data )
        this.$emit('update-success', data.data)
        this.list.push(...results)
        // 3、将 loading 设置为 false
        this.loading = false
        // 4、判断是否还有数据
        if (results.length) {
          //    有数据，则请求获取下一页的数据页面
          //    last_id: 本次返回结果的最后一个评论id，作为请求下一页数据的offset参数，若本次无具体数据，则值为NULL
          this.offset = data.data.last_id
        } else {
          //    没有数据，则将 finished 设置为 true
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style>
</style>
