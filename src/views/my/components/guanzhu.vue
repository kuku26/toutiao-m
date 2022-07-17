<template>
  <div class="update-guanzhu">
    <!-- 导航栏 -->
    <van-nav-bar
      title="关注"
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
        title="我的关注"
        class="my-job"
      >
        <MyGuanzhu />
      </van-tab>
      <van-tab
        title="我的粉丝"
        class="my-job"
      >
        <MyFans />
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import MyGuanzhu from '@/components/User/guanzhu.vue'
import MyFans from '@/components/User/fans.vue'
export default {
  name: 'UpdateGuanzhu',
  components: {
    MyGuanzhu,
    MyFans
  },
  data () {
    return {
      active: this.activeNum
    }
  },
  props: {
    activeNum: {
      type: Number,
      required: true
    }
  }
}
</script>

<style>
</style>
