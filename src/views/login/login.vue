<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="登录"
    >
      <van-icon
        slot="left"
        name="cross"
        @click="$router.back()"
      />
    </van-nav-bar>
    <!-- 登录表单 -->
    <!-- 表单验证： -->
    <!--
      1、给 van-field 组件配置 rules 验证规则  参考文档 ：https://vant-contrib.gitee.io/vant/v2/#/zh-CN/form#rule-shu-ju-jie-gou
      2、当表单提交的时候回会自动触发表单验证
      如果验证通过，会触发 submit 事件
      如果验证失败，不会触发 submit
      -->
    <van-form
      ref="loginForm"
      @submit="onSubmit"
    >
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      ><i
          slot="left-icon"
          class="toutiao toutiao-shouji"
        ></i></van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      ><i
          slot="left-icon"
          class="toutiao toutiao-yanzhengma"
        ></i>
        <template #button>
          <!-- time: 倒计时时间 -->
          <van-count-down
            v-if="isCountDown"
            :time="time"
            format="ss s"
            @finish="isCountDown = false"
          />
          <van-button
            v-else
            native-type="button"
            class="send-sms-btn"
            round
            size="small"
            type="primary"
            @click="onSendSms"
          >获取验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          round
          block
          type="info"
          native-type="submit"
        >登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { setItem } from '@/utils/storage'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      userFormRules: {
        mobile: [
          {
            require: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|9]\d{9}$/,
            message: '手机号格式有误'
          }],
        code: [
          {
            require: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      time: 60 * 1000,
      isCountDown: false
    }
  },
  methods: {
    async onSubmit () {
      // 1、获取表单数据
      const user = this.user
      // 2、TODO：表单验证
      // 在组件中必须通过 this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 通过 forbidClick 属性可以禁用背景点击
        duration: 0 // 持续展示 toast
      })
      // 3、提交表单请求登录
      try {
        const { data } = await login(user)
        console.log(data) // data.data 中有： refresh_token 和 token
        this.$store.commit('setUser', data.data)
        // 将 refresh token 存起来用作刷新 token
        setItem('TOUTIAO_USER', data.data.token)
        localStorage.setItem('refresh_token', data.data.refresh_token)
        this.$toast.success({
          message: '登录成功'
        })
        // 登录成功，跳转回原来页面
        // back 的方式不严谨，后面讲功能优化的时候再说
        this.$router.back()
      } catch (err) {
        this.$toast.fail({
          message: '登录失败'
        })
        if (err.response.status === 400) {
          console.log('手机号或验证码有误！')
        } else {
          console.log('登录失败，请稍后重试', err)
        }
      }
      // 4、根据请求响应结果处理后续操作
    },
    async onSendSms () {
      // 1、校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err) // 如果验证失败不让程序往下执行，只有进入 catch 才会触发 return，如果没报错则会进入 try 然后往下执行
      }
      // 2、验证通过，显示倒计时
      console.log(123)
      this.isCountDown = true
      // 3、请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功！')
      } catch (err) {
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请60s后重新发送')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
}
.send-sms-btn {
  background-color: #ededed;
  border: none;
  color: #666;
}
.login-btn-wrap {
  padding: 53px 28px;
  .login-btn {
    background-color: #6db4fb;
    border: none;
  }
}
</style>
