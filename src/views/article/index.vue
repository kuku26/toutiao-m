<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div
        class="loading-wrap"
        v-if="loading"
      >
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div
        class="article-detail"
        v-else-if="article.title"
      >
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell
          class="user-info"
          center
          :border="false"
        >
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div
            slot="title"
            class="user-name"
          >{{ article.aut_name }}</div>
          <div
            slot="label"
            class="publish-date"
          >
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- $event:是事件参数，内联处理器中的方法 -->
          <!-- 传递给子组件的数据既要使用又要修改 -->
          <!-- 传递: props -->
          <!-- :isFollowed="article.is_followed" -->
          <!-- 修改：自定义事件 -->
          <!-- @update-isFollowed="article.is_followed = $event" -->
          <!-- 简写方式:在组件上使用 v-model
            value="article.is_followed"
            @input="article.is_followed = $event"
            如果要修改 v-model 的规则名称，可通过子组件的 model

            一个组件上只能使用一次 v-model
            如果有多个数据需要实现类似于 v-model 的效果，可以使用属性的.sync 修饰符
          -->

          <FollowUser
            :UserId="article.aut_id"
            v-model="article.is_followed"
            class="follow-btn"
          />
          <!-- <van-button v-if="article.is_followed" @click="onFollow" :loading="followLoading" class="follow-btn" round size="small" >已关注</van-button>
          <van-button v-else @click="onFollow" :loading="followLoading" class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus">关注</van-button > -->

        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <CommentList
          :source="article.art_id"
          @update-success="totalCommentCount = $event.total_count"
          :list="commentList"
          @reply-click="onReplyClick"
        />
        <!-- /文章评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
          >写评论</van-button>
          <van-icon
            name="comment-o"
            :info="totalCommentCount"
            color="#777"
          />
          <CollectArticle
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <LikeArticle
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon
            name="share"
            color="#777777"
          ></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 写评论弹出层 -->
        <van-popup
          v-model="isPostShow"
          position="bottom"
        >
          <CommentPost
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
        <!-- /写评论弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div
        v-else-if="errStatus === 404"
        class="error-wrap"
      >
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div
        v-else
        class="error-wrap"
      >
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button
          class="retry-btn"
          @click="loadArticle"
        >点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论别人的评论 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <CommentReply
        v-if="isReplyShow"
        :comment="currentComment"
        @clickLeft="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论别人的评论 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from '@/views/article/comments/comment-list'
import CommentPost from './comments/comment-post.vue'
import CommentReply from './comments/comment-reply.vue'
// import { addFollows, DeleteFollows } from '@/api/user'

// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   startPosition: 1,
//   closeable: true
// })
export default {
  name: 'ArticleIndex',
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true, // 加载中的 loading 状态
      errStatus: 0 // 失败的状态码
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 控制加载中、加载失败等的显示与隐藏
      followLoading: false, // 默认关注按钮的加载状态是关闭的
      totalCommentCount: 0, // 评论总数
      isPostShow: false, // 控制弹出层显示与隐藏，默认隐藏
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {} // 评论回复
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () { },
  methods: {
    async loadArticle () {
      this.loading = true // 加载未知错误点击重试的时候需要让 “加载中” 状态显示
      try {
        const { data } = await getArticleById(this.articleId)
        // 模拟加载失败
        // if (Math.random() > 0.2) {
        //   JSON.parse('adlkjkdjfdc')
        // }
        console.log(data)
        this.article = data.data
        // 初始化图片点击预览
        // console.log(this.$refs['article-content']) // undefined 数据驱动视图不是立即执行的
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('文章详情获取失败，请稍后重试', err)
      }
      // 无论加载是否成功，都需要把 “加载中” 的状态关闭
      this.loading = false
    },
    previewImage () {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content']
      console.log(articleContent)
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      // 遍历获取所有的 img 地址存入 images 空数组中
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            images: images,
            startPosition: index, // 起始位置从 0 开始
            closeable: true // 显示右上角的关闭按钮
          })
        }
      })
    },
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
      this.totalCommentCount++
    },
    onReplyClick (comment) {
      // console.log(comment)
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown-css.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }

  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;

      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }

      .van-cell__label {
        margin-top: 0;
      }

      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }

      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }

      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;

      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;

    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }

    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }

    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;

    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }

    /deep/ .van-icon {
      font-size: 40px;

      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
