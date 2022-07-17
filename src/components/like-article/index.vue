<template>
  <div class="like-article">
    <van-icon
      :color="value ? '#ffa500' : '#777'"
      :name="value ? 'good-job' : 'good-job-o'"
      @click="onCollect"
    />
  </div>
</template>
<script>
import { likeCollect, dislikeCollect } from '@/api/article/article'
export default {
  name: 'LikeArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: [Boolean, Number],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        let status = false
        if (this.value) { // 已点赞，则取消点赞
          await dislikeCollect(this.articleId)
        } else { // 未点赞，则点赞
          await likeCollect(this.articleId)
          status = true
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(status ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('点赞失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style>
</style>
