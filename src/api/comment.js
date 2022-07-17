// 评论请求模块
import request from '@/utils/request'

// 获取评论或评论回复
export const getComments = params => {
  return request({
    url: '/v1_0/comments',
    method: 'get',
    // get 参数使用 params 进行传递
    // 我们写的时候是对象，但是最终发给后端的数据是？
    // axios 会把 params 对象转为 key=value?key=value... 的格式加到 url 后面
    params
  })
}

// 对评论或评论回复点赞
export const addCommentLike = target => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'post',
    data: {
      target
    }
  })
}

// 取消对评论或评论回复点赞
export const deleteCommentLike = target => {
  return request({
    url: `/v1_0/comment/likings/${target}`,
    method: 'DELETE'
  })
}

// 取消对评论或评论回复点赞
export const addComment = data => {
  return request({
    url: '/v1_0/comments',
    method: 'post',
    data
  })
}
