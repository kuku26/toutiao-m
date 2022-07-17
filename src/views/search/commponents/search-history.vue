<template>
  <div class="search-history">
    <van-cell-group>
      <van-cell title="搜索历史" value="内容">
        <div v-if="isDeleteShow">
          <span @click="$emit('clear-search-histories')">全部删除</span>
          &nbsp;
        <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon name="delete" v-else @click="isDeleteShow = true" />
      </van-cell>
      <van-cell :title="item" v-for="(item, index) in searchHistories" :key="index" @click="onSearchItemClick(item, index)">
        <van-icon name="close" v-show="isDeleteShow" />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data () {
    return {
      isDeleteShow: false // 控制删除的显示与隐藏
    }
  },
  props: {
    // props 数据
    // props 是受父组件数据影响的
    //     如果是普通数据（数字，布尔值，字符串）绝对不能修改，即便修改了也不会传到给父组件
    //     如果是引用类型数据(数组、对象)
    //     可以修改，例如：  [].push(xxx)   对象.xxx = xxx
    //     不能重新赋值： xxx = []
    searchHistories: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录数据
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，点击则进行搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style>

</style>
