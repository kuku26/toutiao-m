<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
      icon="search"
    >
      <div
        slot="title"
        v-html="highlight(text)"
      ></div>
    </van-cell>
    <!-- 双花括号绑定会直接输出纯文本内容 -->
    <!-- <div>{{ htmlStr }}</div> -->

    <!-- 使用 v-html 指令可以绑定渲染带有 HTML 标签的字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'// 优化防抖
export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestions: [], // 联想建议数据列表
      htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候就会调用 handler 函数

      // debounce 函数
      // 参数1：一个函数
      // 参数2：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (value) {
        // console.log(value)
        this.loadSearchSuggestions(value)
      }, 200),
      // immediate 该回调将会在侦听开始之后被立即调用(因为第一次输入内容不会触发 handler )
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      const highlighttStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式：  /此处的内容都会被当作匹配字符来使用，而不是数据变量/
      // 如果需要根据数据变量动态地创建正则表达式，则需要手动 new RegExp()
      // RegExp() 正则表达式构造函数
      //          参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //          参数2：匹配模式：要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlighttStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
