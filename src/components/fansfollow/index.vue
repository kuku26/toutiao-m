<template>
  <van-button
    v-if="isFollowed"
    @click="onFollow"
    :loading="loading"
    class="follow-btn"
    round
    size="small"
  >互相关注</van-button>
  <van-button
    v-else
    @click="onFollow"
    :loading="loading"
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
  >关注</van-button>
</template>

<script>
import { addFollows, DeleteFollows } from '@/api/user'
export default {
  name: 'fansFollow',
  model: {
    prop: 'isFollowed', // 默认是 value
    event: 'update-is_followed' // 默认是 input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    UserId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onFollow () {
      this.loading = true // 一旦触发 onFollow ，显示加载中按钮
      try {
        // }
        if (this.isFollowed) {
          // 已关注，则取消关注
          await DeleteFollows(this.UserId)
          // this.isFollowed = false
        } else {
          // 未关注，则关注
          await addFollows(this.UserId)
          // this.isFollowed = true
        }
        // 无论是否关注，点击该按钮都要取反
        // this.isFollowed = !this.isFollowed
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '用户不能关注自己！'
        }
        this.$toast(message)
      }
      this.loading = false // 无论是否请求成功 ，最终都要隐藏加载中按钮
    }
  }
}
</script>

<style></style>
