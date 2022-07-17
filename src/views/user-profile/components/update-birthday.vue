<template>
  <div class="update-birthday">
    <!-- currentDate 双向绑定了日期选择器 -->
    <!--      设置日期选择器的默认值 -->
    <!--      同步日期选择权选择的日期 -->
    <!-- min-date  可选的最小日期 -->
    <!-- max-date  可选的最大日期（默认给出当天的日期） -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  data () {
    return {
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  props: {
    value: {
      type: String,
      required: true
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
        const newCurrentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          birthday: newCurrentDate
        })
        // 通知父组件更新视图
        this.$emit('input', newCurrentDate)
        // 关闭弹出层
        this.$emit('close')
        // 提示修改成功
        this.$toast.success('已更新')
      } catch (err) {
        this.$toast.fail('生日修改失败，请重试！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-name {
  .field-wrap {
    padding: 30px 10px;
  }
}
</style>
