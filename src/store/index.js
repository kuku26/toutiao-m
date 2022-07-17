import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  // 获取用户数据
  state: {
    // 一个对象：存储当前登录用户的信息， token等数据
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    // 存储用户数据
    setUser (state, data) {
      state.user = data
      // 为了防止刷新丢失数据（vuex刷新会丢失数据）,我们需要把数据备份到本地存储（本地存储的是JSON格式字符串，需要转换）
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
