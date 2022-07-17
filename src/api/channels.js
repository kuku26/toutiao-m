/* 频道请求模块 */
import request from '@/utils/request'
// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/v1_0/channels'
  })
}
// 获取用户的频道（部分覆盖）
export const addUserChannel = channel => {
  return request({
    method: 'patch',
    url: '/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}
// 删除指定用户频道
export const deleteUserChannel = channelid => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelid}`
  })
}
