<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
      left-arrow
    >
      <van-icon
        name="cross"
        slot="left"
        @click="$emit('clickLeft')"
      />
    </van-nav-bar>
    <!-- 当前评论项 -->
    <div class="scroll-wrap">
      <CommentGuanzhu :comment="comment" />
      <!-- /当前评论项 -->

      <!-- 评论回复项 -->
      <van-cell title="全部回复" />
      <CommentList
        :source="comment.com_id"
        type="c"
        :list="commentList"
      />
    </div>
    <!-- /评论回复项 -->

    <!-- 底部区域 -->
    <div class="post-wrap">
      <van-button
        class="post-btn"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <CommentPost
        :target="comment.com_id"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- /发布评论 -->

  </div>
</template>

<script>
import CommentGuanzhu from '@/views/article/comments/comment-guanzhu.vue'
import CommentList from '@/views/article/comments/comment-list.vue'
import CommentPost from '@/views/article/comments/comment-post.vue'
export default {
  name: 'CommentReply',
  components: {
    CommentGuanzhu,
    CommentList,
    CommentPost
  },
  data () {
    return {
      isPostShow: false, // 控制回复弹出层的显示与隐藏
      commentList: [] // 存放回复的数组，传给子组件渲染用
    }
  },
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹出层
      this.isPostShow = false
      // 将内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.comment-reply {
  .scroll-wrap {
    position: fixed;
    bottom: 88px;
    top: 92px;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
  .post-wrap {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    height: 88px;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .post-btn {
      width: 60%;
    }
  }
}
</style>
