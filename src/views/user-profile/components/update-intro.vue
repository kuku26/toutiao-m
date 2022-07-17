<template>
  <div class="update-intro">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改个人简介"
      left-text="返回"
      right-text="完成"
      left-arrow
      @click-left="$emit('close')"
      @click-right="onConfirm"
    >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 个人简介输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localIntro"
        rows="2"
        autosize
        type="textarea"
        maxlength="100"
        placeholder="请输入内容"
        show-word-limit
      />
    </div>
    <!-- /个人简介输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateIntro',
  data () {
    return {
      localIntro: this.value || ''
    }
  },
  props: {
    value: {
      type: String
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // console.log(!0) // true
        const localIntro = this.localIntro
        if (!localIntro.length) {
          this.$toast('不能为空！')
          return
        }
        await updateUserProfile({
          intro: localIntro
        })
        // 更新视图
        this.$emit('input', localIntro)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('已更新')
      } catch (err) {
        this.$toast.fail('修改失败，请重试！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-intro {
  .field-wrap {
    padding: 30px 10px;
  }
}
</style>
