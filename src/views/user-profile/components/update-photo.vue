<template>
  <div class="update-photo">
    <img
      class="img"
      :src="img"
      ref="img"
    >
    <div class="toolbar">
      <div
        class="cancel"
        @click="$emit('close')"
      >取消</div>
      <div
        class="confirm"
        @click="onConfirm"
      >完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 查看模式：将裁剪框限制为画布大小，默认为 0
      dragMode: 'move', // 拖动模式(裁剪区域拖动、大小)画布可拖动
      aspectRatio: 1, // 截图比例 1：1 正方形
      autoCropArea: 1, // 自动截取区域 自动撑满整个画布大小，不会超过1:1比例
      cropBoxMovable: false, // 固定画布移动不超过图片区域
      cropBoxResizable: false, // 是否允许缩放
      background: false, // 画布背景
      movable: true // 画布是否可以移动
    })
    // console.log(cropper)
  },
  methods: {
    onConfirm () {
      // 基于服务端的裁切使用 getData 方法获取裁切的参数
      // console.log(this.cropper.getData())
      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象（适用于移动端，不考虑兼容问题）
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // console.log(blob)
        // 错误用法：
        // 如果接口要求 Content-Type 是 application/json
        // 则传递的是普通 JavaScript 对象
        // await updateUserPhoto({
        //   photo: blob
        // })

        // 如果接口要求 Content-Type 是 multipart/form-data
        // 则必须传递 FormData 对象
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        // console.log(data.data.photo)

        // 更新视图
        this.$emit('update-photo', data.data.photo)
        // 关闭该弹出层
        this.$emit('close')
        // 提示成功
        this.$toast.success('已更新')
      } catch (err) {
        this.$toast.fail('上传头像失败，请重试！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .img {
    width: 100%;
  }
  .toolbar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 110px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 30px;
    }
  }
}
</style>
