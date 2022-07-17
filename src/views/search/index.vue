<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。搜索框内容对齐 -->
    <form
      action="/"
      class="search-form"
    >
      <van-search
        v-model="searchText"
        show-action
        v-fofo
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <SearchResult
      v-if="isResultShow"
      :search-text="searchText"
    />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <SearchSuggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <SearchHistory
      v-else
      :searchHistories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    />
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchHistory from './commponents/search-history'
import SearchSuggestion from './commponents/search-suggestion'
import SearchResult from './commponents/search-result'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的显示与隐藏
      searchHistories: [] // 存放历史记录
    }
  },
  methods: {
    onSearch (val) { // search 事件在点击键盘上的搜索/回车按钮后触发,value: string (当前输入的值)
      console.log(val)
      // 更新文本框内容
      this.searchText = val
      // 存储搜索历史记录（在显示搜索结果之前把历史记录存储起来）
      //    要求：不要有重复历史记录，最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 显示搜索结果
      this.isResultShow = true
    },
    onCancel () { // cancel 事件在点击搜索框右侧取消钮时触发
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
