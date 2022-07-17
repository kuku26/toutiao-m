<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view />
    <!-- 底部标签导航栏 -->
    <van-tabbar
      route
      class="layout-tabbar"
    >
      <van-tabbar-item to="/">
        <i
          slot="icon"
          class="toutiao toutiao-shouye"
        ></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i
          slot="icon"
          class="toutiao toutiao-wode"
        ></i>
        <span class="text">{{ $store.state.user ? '我的' : '未登录'}}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex'
}

</script>

<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
