import request from '@/utils/request'
// 获取电影分页数据
export const reqOrder = (page, limit = 10, vague = false, searchParams = '') => request({
  url: `/admin/order/list/?page=${page}&limit=${limit}&vague=${vague}&searchParams=${searchParams}`,
  method: 'get'
})

// 新增电影
export const addOrder = (form) => request({
  url: '/admin/order/list/',
  method: 'post',
  data: {
    form
  }
})
export const deleteOrder = (id) => request({
  url: '/admin/order/list/',
  method: 'delete',
  data: {
    id
  }
})
export const refundOrder = (id) => request({
  url: `/admin/order/refund/${id}/`,
  method: 'post'
})
export const recharge = (id, plus) => request({
  url: 'admin/order/recharge/',
  method: 'post',
  data: {
    id, plus
  }
})
export const getOrder = (user_id = '') => request({
  url: `admin/order/user_order/?user_id=${user_id}`,
  method: 'get'
})
export const remark = (form = {}) => request({
  url: 'admin/order/remark/',
  method: 'post',
  data: {
    form
  }
})
