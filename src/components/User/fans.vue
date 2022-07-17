<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="已显示全部关注"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
  >
    <van-cell
      v-for="(item, index) in list"
      :key="index"
      :title="item.name"
      icon="shop-o"
      center
    >
      <van-image
        slot="icon"
        round
        width="50"
        height="50px"
        :src="item.photo"
      />
      <div slot="label">粉丝数：{{item.fans_count}}&nbsp;人</div>
      <fansFollow
        :UserId="item.id ? item.id : '' "
        v-model="item.mutual_follow"
      />
    </van-cell>
  </van-list>
</template>

<script>
import { updateFollowers } from '@/api/user'
import fansFollow from '@/components/fansfollow'
export default {
  name: 'MyFans',
  data () {
    return {
      limit: 15, // 每页的关注数量
      list: [], // 关注列表
      loading: false,
      error: false,
      finished: false,
      page: 1,
      per_page: 10
    }
  },
  components: {
    fansFollow
  },
  created () {
    // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading 加载效果,所以我们要手动开启初始 loading 加载效果
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        // 1、请求获取数据
        const { data } = await updateFollowers({
          page: this.page,
          per_page: this.per_page
        })
        // console.log(data.data.results)
        // console.log(data.data.total_count)
        // 2、将数据铺设到页面，添加到列表中
        const { results } = data.data
        this.list.push(...results)
        console.log(this.list)
        // if (results.name) {
        //   this.isFollowed = true
        // } else {
        //   this.isFollowed = false
        // }
        // 3、将 loading 设置为 false
        this.loading = false
        // 4、判断是否还有数据
        if (results.length) {
          this.page++
        } else {
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

<style scoped lang="less">
.van-cell__title {
  margin-left: 20px;
}
</style>
