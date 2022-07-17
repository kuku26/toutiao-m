<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小智同学"
    ></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div
        v-for="(obj, index) in list"
        :key="index"
      >
        <!-- 左侧是机器人小智 -->
        <div
          class="chat-item left"
          v-if="obj.name !== 'me'"
        >
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{obj.msg}}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div
          class="chat-item right"
          v-else
        >
          <div class="chat-pao">{{obj.msg}}</div>
          <van-image
            fit="cover"
            round
            :src="imgStr"
          />
        </div>
      </div>
    </div>
    <!-- 对话发送区域 -->
    <div class="reply-container van-hairline--top">
      <van-field
        v-model="word"
        placeholder="说点什么吧..."
      >
        <template #button>
          <span
            style="font-size:12px;color:#999"
            @click="sendFn"
          >提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { getItem } from '@/utils/storage'
import { getUserProfile } from '@/api/user'
export default {
  name: 'ChatRobot',
  data () {
    return {
      imgStr: null, // 用户头像获取
      word: '', // 输入框的内容
      list: [ // 所有的聊天信息
        // 只能根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
        { name: 'xz', msg: 'hi，你好！我是小智' },
        { name: 'me', msg: '我是酷酷' }
      ],
      socket: null // 客户端和服务器建立连接的 socket 对象
    }
  },
  async created () {
    const { data } = await getUserProfile()
    this.imgStr = data.data.photo
    console.log(this.imgStr)
    // 注意： io 是建立 socket 连接，与 axios 没有任何关系
    this.socket = io('http://toutiao.itheima.net', {
      query: {
        token: getItem()
      },
      transports: ['websocket']
    })

    // 测试下是否建立连接成功
    this.socket.on('connect', () => {
      console.log('链接建立成功')
    })

    // 接收后端传回来的消息
    this.socket.on('message', obj => {
      // 理解组织相同字段对象放到数组里 -> v-for 更新
      this.list.push({
        name: 'xz',
        msg: obj.msg
      })
      // 让最后一条聊天信息滚动到屏幕范围
      // 数据变化 -> DOM 更新是异步的，所以获取到的是倒数第二条 div ，而不是最后一条
      // $nextTick() 会等待异步更新后再操作
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    })
  },

  methods: {
    // 发送用户的信息 -> 点击事件
    sendFn () {
      // 判断输入框是否为空，为空直接 return
      if (this.word.trim().length === 0) return
      // 用 socket 连接 对象.emit(后端接收消息的事件名，并且把值带给后端)
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime()
      })

      // 把消息显示到页面上
      this.list.push({
        msg: this.word,
        name: 'me'
      })

      // 让机器人的回复滚动，也要让用户发送的消息同样滚动，调用一下即可
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      // 清空一下输入框
      this.word = ''
    },

    // 滚动到页面底部 -> 封装成一个函数
    scrollToBottom () {
      // 获取到聊天消息 list 中最右一个 消息
      const theLastDiv = document.querySelector('.chat-list>div:last-child')
      // 调用 scrollIntoView() 方法，显示这个元素
      theLastDiv.scrollIntoView({
        behavior: 'smooth' // 动画平滑
      })
    }
  },

  // 该组件销毁时，关闭连接服务并且置空它，节约资源（不关闭的话该连接服务即使关闭了该页面仍然存在）
  destroyed () {
    // 关闭连接
    this.socket.close()
    // 销毁 websocket 实例对象
    this.socket = null
  }
}
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  .van-nav-bar {
    height: 92px;
  }
  .chat-list {
    height: 85%;
    overflow-y: scroll;
    margin-top: 92px;
    .chat-item {
      padding: 25px 25px 15px 25px;
      .van-image {
        vertical-align: middle;
        width: 80px;
        height: 80px;
      }
      .chat-pao {
        vertical-align: middle;
        display: inline-block;
        min-width: 50px;
        max-width: 70%;
        min-height: 50px;
        line-height: 60px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 16px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 20px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 95px;
  width: 100%;
  background: #f5f5f5;
}
</style>
