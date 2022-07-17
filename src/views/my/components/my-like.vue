<template>
  <div class="article-list">
    <!-- 导航栏 -->
    <van-nav-bar
      title="我的收藏"
      class="page-nav-bar"
      left-arrow
      @click-left="$emit('close')"
    >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 文章列表 -->
    <!-- 文章内容 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <LikeNoImages
        v-for="(article, index) in list"
        :key="index"
        :article="article"
      />
    </van-list>
  </div>
</template>

<script>
import { userLikeList } from '@/api/user'
import LikeNoImages from '@/components/article-item/like-noimages.vue'
export default {
  name: 'MyLikeList',
  components: {
    LikeNoImages
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      error: false, // 控制列表加载失败的提示状态 若列表数据加载失败，将 error 设置成 true 即可显示错误提示，用户点击错误提示后会重新触发 load 事件。
      page: 1, // 页数，不传默认为1
      per_page: 20 // 每页数量，不传每页数量由后端决定
    }
  },
  methods: { // 初始化或滚动到底部的时候会触发调用 onLoad 事件
    async onLoad () {
      try {
        // 1、请求获取数据
        const { data } = await userLikeList({
          page: this.page,
          per_page: this.per_page
        })
        // // 模拟随机加载失败的情况
        // if (Math.random() > 0.5) { // 伪随机数在范围从0 到小于1，让该条命令随机执行
        //   JSON.parse('jdlkajdkdlk')// 该字符串不是标准JSON格式的字符串，一转换必报错，用于做错误提示测试的
        // }
        // console.log(data)
        const { results } = data.data
        // 2、把请求结果数据放到 list 数组中
        this.list.push(...results)
        // 3、本次数据在家结束之后把加载状态设置为结束
        this.loading = false
        console.log(this.list)
        // 4、判断数据是否全部加载完成
        this.page++
        this.finished = true
      } catch (err) {
        this.error = true // 展示错误提示状态
        this.loading = false // 请求失败了，loading需要设置为 false ，因为触底事件会自动使loading = true
      }
      // 数据全部加载完成
    }
  }
}

</script>

<style scoped lang="less">
// 原本的滚动不是在自己内容滚动，而是整个 body 页面在滚动，无论你是在 a 频道还是 b 频道，其实滚动的都是 body 元素
// 如何让每一个标签内容文章列表产生自己的滚动容器？
// height: 79vh; // 固定高度，
// overflow-y: auto; // 溢出滚动

// css3中新增的一种视口单位 vw 和 vh ，根据浏览器窗口的大小的单位，不受父元素影响
// vh / vw = 可视窗口高度 / 宽度 * 0.01
// eg:
// 窗口高度667px ， 1vh = 6.67px
// 窗口宽度750px ， 1vh = 7.5px
// 有兼容性问题, 但移动端无需担心
.article-list {
  height: 79vh; // 固定高度，不能写百分比，百分比来自父元素高度
  overflow-y: auto; // 溢出滚动  注意是y轴
}
</style>
