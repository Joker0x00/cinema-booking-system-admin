import request from '@/utils/request'
// 获取电影分页数据
export const reqUser = (page, limit = 10, vague = false, searchParams = '') => request({
  url: `/admin/user/user_list/?page=${page}&limit=${limit}&vague=${vague}&searchParams=${searchParams}`,
  method: 'get'
})

// 新增电影
export const addUser = (form) => request({
  url: '/admin/user/user_list/',
  method: 'post',
  data: {
    form
  }
})
// 编辑电影
export const editUser = (form) => request({
  url: '/admin/user/user_list/',
  method: 'put',
  data: {
    form
  }
})
// 删除某一部电影
export const deleteUser = (id) => request({
  url: '/admin/user/user_list/',
  method: 'delete',
  data: {
    id
  }
})

export const getUserName = () => request({
  url: '/admin/user/user_name/',
  method: 'get'
})
