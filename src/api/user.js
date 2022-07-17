/**
 * 用户相关请求模块
 */
import request from '@/utils/request'
// import store from '@/store'

export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 获取短信验证码
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}` // 接口访问次数受限  每手机号每分钟1次
  })
}

//  获取用户自己的信息
export const getUserInfo = () => {
  return request({
    url: '/v1_0/user',
    method: 'GET'
    // axios 发起请求会自带相应的请求头，但下方是我们需要手动添加的请求头数据（查看接口文档）
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取文章频道列表（不强制用户登录，匿名用户返回后台设置的默认频道列表）
export const getUserChannels = () => {
  return request({
    url: '/v1_0/user/channels',
    method: 'GET'
  })
}

// 点击关注用户
export const addFollows = target => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target
    }
  })
}

// 点击取消关注用户
export const DeleteFollows = target => {
  return request({
    url: `/v1_0/user/followings/${target}`,
    method: 'DELETE'
  })
}

// 获取用户个人资料
export const getUserProfile = () => {
  return request({
    url: '/v1_0/user/profile',
    method: 'get'
  })
}

// 更新用户个人资料/更新用户个人简介
export const updateUserProfile = data => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}

// 编辑用户照片资料（头像、身份证照片）
export const updateUserPhoto = photo => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: photo
  })
}

// 获取用户的关注列表
export const updateFollowerings = params => {
  return request({
    url: '/v1_0/user/followings',
    method: 'GET',
    params
  })
}

// 获取用户的粉丝列表
export const updateFollowers = params => {
  return request({
    url: '/v1_0/user/followers',
    method: 'GET',
    params
  })
}

// 获取用户收藏列表
export const userLikeList = data => {
  return request({
    url: '/v1_0/article/collections',
    method: 'GET',
    data
  })
}

// 获取用户阅读历史
export const userHistoryList = data => {
  return request({
    url: '/v1_0/user/histories',
    method: 'GET',
    data
  })
}
