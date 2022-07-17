<template>
  <div class="update-toutiao">
    <!-- 导航栏 -->
    <van-nav-bar
      title="动态"
      class="page-nav-bar"
      left-arrow
      @click-left="$emit('close')"
    >
    </van-nav-bar>
    <!-- /导航栏 -->
    <van-tabs
      v-model="active"
      class="infro-list"
    >
      <van-tab
        title="作品"
        class="my-job"
      >
        <div class="img">
          <van-image
            src="https://img01.yzcdn.cn/vant/empty-image-default.png" />
          <p>暂无数据</p>
        </div>
      </van-tab>
      <van-tab
        title="公告"
        class="my-job"
      >
        <div class="img">
          <van-image
            src="https://img01.yzcdn.cn/vant/empty-image-default.png" />
          <p>暂无数据</p>
        </div>
      </van-tab>
      <van-tab
        title="数据"
        class="my-infor"
      >
        <van-grid
          class="my-infro-grid"
          :gutter="10"
          :column-num="2"
          clickable
        >
          <van-cell
            class="my-infro-grid-cell"
            title="粉丝数"
            is-link
            size="large"
          ><span
              class="my-infro-grid-cell-span"
              slot="label"
            >{{fanscount ? fanscount : '0'}}</span><span slot="label">人</span>
          </van-cell>
          <van-cell
            class="my-infro-grid-cell"
            title="阅读数"
            size="large"
          ><span
              class="my-infro-grid-cell-span"
              slot="label"
            >0</span><span slot="label">次</span></van-cell>
        </van-grid>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { updateFollowers } from '@/api/user'
export default {
  name: 'UpdateToutiao',
  data () {
    return {
      active: 0, // 默认显示 “作品” 页面
      fanscount: 0 // 粉丝数量
    }
  },
  created () {
    this.onFollows()
  },
  methods: {
    async onFollows () {
      try {
        const { data } = await updateFollowers()
        // console.log(data.data)
        this.fanscount = data.data.results.fans_count
      } catch (err) {
        this.$toast.fail('查看粉丝数失败，请重试！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-toutiao {
  /deep/ .infro-list {
    .my-job {
      .img {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 30px;
      }
    }
    .my-infor {
      .my-infro-grid {
        margin-top: 25px;
        flex-wrap: nowrap;
        .my-infro-grid-cell {
          margin: 15px;
          background-color: #f9f9f9;
          .my-infro-grid-cell-span {
            color: black;
            margin-right: 15px;
            font-size: 45px;
          }
        }
      }
    }
  }
}
</style>
