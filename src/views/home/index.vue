<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      fixed
    >
      <van-button
        class="search-btn"
        slot="title"
        round
        type="info"
        icon="search"
        size="small"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
    <van-tabs
      v-model="active"
      animated
      swipeable
      class="channel-tabs"
    >
      <van-tab
        v-for="channel in channels"
        :title="channel.name"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <div
        slot="nav-right"
        class="placeholder"
      > </div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        @update-active="onUpdateActive"
        :myChannels="channels"
        :myactive="active"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/aritcle-list.vue'
import ChannelEdit from './components/channel.edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [], // 存储频道列表
      isChannelEditShow: false // 默认不显示编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannerls()
  },
  methods: {
    async loadChannerls () {
      try {
        // const { data } = await getUserChannels()
        // console.log(data)
        // this.channels = data.data.channels
        let thridchannels = []
        // 1、判断是否登录
        if (this.user) {
          // 2、判断为已登录(user中有值)，调用接口获取后端频道列表
          const { data } = await getUserChannels()
          thridchannels = data.data.channels
        } else { // 2、判断为未登录(user中无值)，获取本地存储的频道列表
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) { // 3、未登录时，判断本地是否存有频道列表
            // 4、本地存有频道列表，获取本地的频道列表
            thridchannels = localChannels
          } else { // 4、本地没有频道列表，从后台获取默认未登录的频道列表
            const { data } = await getUserChannels()
            thridchannels = data.data.channels
          }
        }
        this.channels = thridchannels
        console.log(this.channels)
      } catch (err) {
        console.log(err)
        this.$toast('获取文章频道列表失败')
      }
    },
    onUpdateActive (index, secChannelEditShow = true) {
      this.active = index
      this.isChannelEditShow = secChannelEditShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 180px;
  margin-bottom: 100px;
  .page-nav-bar {
    .search-btn {
      width: 555px;
      height: 64px;
      font-size: 28px;
      line-height: 64px;
      background-color: #5babfb;
    }
    .van-nav-bar__title {
      max-width: unset;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
      font-size: 27px;
      color: rgb(162, 150, 150);
    }
    .van-tab--active {
      color: rgb(27, 26, 26);
    }
    .van-tabs__line {
      width: 80px !important;
      height: 6px;
      background-color: #3296fa;
      border-radius: 3px;
      bottom: 0;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.9;
      display: flex;
      justify-content: center;
      align-items: center;
      .toutiao-gengduo {
        font-size: 40px;
      }
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
  }
}
</style>
