<template>
  <div class="collect-article">
    <van-icon :color="value ? '#ffa500' : '#777'" :name="value ? 'star' : 'star-o'" @click="onCollect" />
  </div>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article/article'
export default {
  name: 'CollectArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object]
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏，则取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏，则收藏
          await addCollect(this.articleId)
        }
        // 更新视图(视图不是立即更新的，需要通知父组件去更改视图的改变)
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '已收藏' : '取消收藏')
      } catch (err) {
        this.$toast('收藏失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style>

</style>
