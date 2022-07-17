<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div
        slot="title"
        class="title-text"
      >我的频道</div>
      <van-button
        @click="isEdit=!isEdit"
        class="edit-btn"
        type="danger"
        plain
        round
        size="small"
      >{{isEdit ? '完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid
      class="my-grid"
      :gutter="10"
    >
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        :text="channel.name"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false。 -->
        <van-icon
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- v-bind:class"{ 类名: 值1 === 值2 }"  一个对象：对象中的 key 表示要作用的 css 类名，对象中的 value 要计算出布尔值，true:作用该类名，false：不作用该类名-->
        <div
          slot="text"
          class="text"
          :class="{active: index === myactive}"
        >{{channel.name}}</div>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div
        slot="title"
        class="title-text"
      >频道推荐</div>
      <van-button
        type="danger"
        class="edit-btn"
        plain
        round
        size="small"
      >编辑</van-button>
    </van-cell>
    <van-grid
      class="recommond-grid"
      :gutter="10"
    >
      <van-grid-item
        @click="onAddChannel(channel)"
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channels'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    myactive: {
      type: Number,
      required: true
    }
  },
  name: 'ChannelEdit',
  data () {
    return {
      allChannels: [], // 存储从后端获取到的所有频道列表
      isEdit: false, // 控制编辑状态的显示按钮
      fiexdChannels: [0, 1, 4, 6] // 固定 频道 id 为 0("推荐"), 1("html"), 4("c++"), 6("css") 的不被删除
    }
  },
  created () {
    this.localAllChannels()
  },
  methods: {
    async localAllChannels () {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取所有频道列表失败')
      }
    },
    async onAddChannel (channel) {
      // console.log(channel)
      this.myChannels.push(channel)

      // 数据持久化处理(判断本地是否传入了 user)
      if (this.user) {
        try {
          // 已登录：把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道的 id
            seq: this.myChannels.length // 顺序序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录：把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      // console.log(channel)// 具体某频道的对象 存放了频道的 id 和 name
      // console.log(index)// 索引
      if (this.isEdit) {
        // 1、判断如果是固定频道则不可删除 fiexdChannels: [0, 1, 3, 6]，直接return 不执行下面删除操作
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 2、删除频道项
        this.myChannels.splice(index, 1)

        // 3、编辑状态：点击谁就移除谁到“频道推荐”里去
        if (channel.id <= this.myactive) {
          this.$emit('update-active', this.myactive - 1, true)
        }
        // 4、处理删除持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态：点击谁就显示谁的文章列表
        this.$emit('update-active', index, false)
      }
    },
    // 处理删除持久化
    async deleteChannel (channel) {
      if (this.user) {
        // 已登录，将数据更新到线上
        await deleteUserChannel(channel.id)
      } else {
        // 未登录,将数据更新到本地(覆盖本地存储的数据)
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性会观测内部依赖数据的变化
    // 如果一栏的数据发生变化，则计算属性会重新执行
    recommendChannels () {
      // 数组 filter 方法，遍历数组，把符合条件的元素自动存到新数组中
      // filter() 方法创建一个新数组，其包含通过所提供函数实现的测试的所有元素
      return this.allChannels.filter(channel => {
        // 数组 find 方法，遍历数组，返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。（这里我们取反了）
        return !this.myChannels.find(ownchannel => {
          return ownchannel.id === channel.id
        })
      })
    }
    // recommendChannels () {
    //   const recomchannels = []
    //   // 遍历从后端获取的所有的频道
    //   this.allChannels.forEach(channel => {
    //     // find 遍历数组，找到满足条件的元素项（遍历用户个人的频道与所有频道的 id ，两者相等则筛选出来）
    //     const ret = this.myChannels.find(myChannels => {
    //       return myChannels.id === channel.id
    //     })
    //     console.log(ret)
    //     if (!ret) {
    //       recomchannels.push(channel)
    //     }
    //   })
    //   return recomchannels
    // }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 84px;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    line-height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 68px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        margin-top: 0;
        color: #222;
      }
    }
  }
  /deep/ .recommond-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        white-space: nowrap;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-grid-item__icon-wrapper {
        position: unset;
        .van-icon-clear {
          position: absolute;
          font-size: 30px;
          right: -10px;
          top: -10px;
          z-index: 2;
          color: #9a9a9a;
        }
      }
      .active {
        color: red;
      }
    }
  }
}
</style>
