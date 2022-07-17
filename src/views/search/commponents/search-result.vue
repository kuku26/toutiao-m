<template>
  <div class="search-result">
    <!-- List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页数，不传默认为1
      perPage: 20, // 每页数量，不传每页数量由后端决定
      error: false // 将 error 设置成 true 即可显示错误提示，用户点击错误提示后会重新触发 load 事件
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1、发起请求获取搜索结果
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页多少条数据
          q: this.searchText // 查询关键词
        })
        console.log(data)

        // 测试请求数据失败的错误提示效果
        // if (Math.random() > 0.5) {
        //   JSON.parse('kjdkjkjf')
        // }
        // 2、将数据添加到数据列表中
        const { results } = data.data
        this.list.push(...results)
        // 3、将本次加载中的 loading 关闭
        this.loading = false
        // 4、判断是否还有数据
        if (results.length) {
          //    如果有，则更新获取下一个数据的页码
          this.page++
        } else {
          //    如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false // 因为用户点击错误提示后会重新触发 load 事件
      }
    }
  }
}
</script>

<style>
</style>
