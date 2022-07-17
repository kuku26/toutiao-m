import request from '@/utils/request'

// 获取文章新闻推荐
export const getArticles = params => {
  return request({
    url: '/v1_0/articles',
    method: 'GET',
    params
  })
}

// 获取新闻详情
export const getArticleById = articleid => {
  return request({
    url: `/v1_0/articles/${articleid}`,
    method: 'GET'
  })
}

// 收藏文章
export const addCollect = target => {
  return request({
    url: '/v1_0/article/collections',
    method: 'post',
    data: {
      target
    }
  })
}

// 取消收藏文章
export const deleteCollect = target => {
  return request({
    url: `/v1_0/article/collections/${target}`,
    method: 'delete'
  })
}

// 对文章点赞
export const likeCollect = target => {
  return request({
    url: '/v1_0/article/likings',
    method: 'post',
    data: {
      target
    }
  })
}

// 取消对文章点赞
export const dislikeCollect = target => {
  return request({
    url: `/v1_0/article/likings/${target}`,
    method: 'DELETE'
  })
}
