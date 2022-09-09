import request from '@/utils/request'
// 获取电影分页数据
export const reqComment = (page, limit = 10, searchParams = '', sort = '') => request({
  url: `/admin/comment/list/?page=${page}&limit=${limit}&sort=${sort}&searchParams=${searchParams}`,
  method: 'get'
})

export const deleteComment = (id) => request({
  url: '/admin/comment/list/',
  method: 'delete',
  data: {
    id
  }
})
