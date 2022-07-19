<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 头像文件选择 -->
    <input
      type="file"
      hidden
      ref="file"
      v-fofo
      @change="onChange"
    />
    <!-- /头像文件选择 -->
    <!-- 个人信息 -->
    <van-cell
      title="头像"
      value="内容"
      is-link
      @click="$refs.file.click()"
    >
      <van-image
        class="avater"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="个人简介"
      :value="user.intro"
      is-link
      @click="isUpdateIntroShow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender === 1 ? '女' : '男'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    />
    <!-- /个人信息 -->

    <!-- 昵称编辑弹出层 -->
    <van-popup
      v-model="isUpdateNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdateName
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- /昵称编辑弹出层 -->

    <!-- 个人简介编辑弹出层 -->
    <van-popup
      v-model="isUpdateIntroShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdateIntro
        v-if="isUpdateIntroShow"
        @close="isUpdateIntroShow = false"
        v-model="user.intro"
      />
    </van-popup>
    <!-- /个人简介编辑弹出层 -->

    <!-- 性别编辑弹出层 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <UpdateGender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- /性别编辑弹出层 -->

    <!-- 生日编辑弹出层 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <UpdateBirthday
        v-if="isUpdateBirthdayShow"
        @close="isUpdateBirthdayShow = false"
        v-model="user.birthday"
      />
    </van-popup>
    <!-- /生日编辑弹出层 -->

    <!-- 头像编辑弹出层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdatePhoto
        v-if="isUpdatePhotoShow"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
        v-model="user.birthday"
        :img="img"
      />
    </van-popup>
    <!-- /头像编辑弹出层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
import UpdateIntro from './components/update-intro.vue'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
    UpdateIntro
  },
  created () {
    this.loadUserProfie()
  },
  data () {
    return {
      user: {}, // 个人信息存放处
      isUpdateNameShow: false, // 控制昵称弹出层的显示与隐藏
      isUpdateGenderShow: false, // 控制性别弹出层的显示与隐藏
      isUpdateBirthdayShow: false, // 控制生日弹出层的显示与隐藏
      isUpdatePhotoShow: false, // 控制头像弹出层的显示与隐藏
      isUpdateIntroShow: false, // 控制个人简介弹出层的显示与隐藏
      img: null // 存放用户选择的头像图片
    }
  },
  methods: {
    async loadUserProfie () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
        // 第一种方式直接使用：将用户头像保存到 vuex 中
        // this.$store.commit('SET_USERPHOTO', this.user.photo)
        // 第二种方式映射使用：从 vuex 中拿到，通过辅助函数把 mutations 方法映射过来
        // this.SET_USERPHOTO(this.user.photo)
      } catch (err) {
        this.$toast.fail('获取个人信息失败，请重试！')
      }
    },
    onChange () {
      // 获取文件对象
      console.log(this.$refs.file.files)
      const needfile = this.$refs.file.files[0]
      // 基于文章对象获取 blob 图片数据
      // File对象是什么？在浏览器的html页面，通过input type=files 选择文件即可得到一个file对象
      // Blob对象是什么？是浏览器请求图片Url得到返回的二进制对象
      // createObjectURL: 创建一个可用于获取File或Blob对象的 URL。
      // window.URL.createObjectURL: 可以用于在浏览器上预览本地图片或者视频
      this.img = window.URL.createObjectURL(needfile)
      // console.log(img)

      this.isUpdatePhotoShow = true
      // file-input 如果选择了同一个文件就不会触发 change 事件
      // 解决：每次使用完毕该弹出层，把它的 value 清空即可
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avater {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
