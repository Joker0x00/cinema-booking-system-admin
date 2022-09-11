import request from '@/utils/request'
// 获取电影分页数据
export const reqAdmin = (k = '') => request({
  url: `/admin/user/admin_list/?key=${k}`,
  method: 'get'
})

// 新增电影
export const addAdmin = (form) => request({
  url: '/admin/user/admin_list/',
  method: 'post',
  data: {
    form
  }
})
// 编辑电影
export const editAdmin = (form) => request({
  url: '/admin/user/admin_list/',
  method: 'put',
  data: {
    form
  }
})
// 删除某一部电影
export const deleteAdmin = (id) => request({
  url: '/admin/user/admin_list/',
  method: 'delete',
  data: {
    id
  }
})

// 修改密码
export const changePass = (id, pass) => request({
  url: 'admin/user/admin_changepass/',
  method: 'post',
  data: {
    id,
    pass
  }
})

// 修改用户名
export const changeUsername = (id, username) => request({
  url: 'admin/user/admin_changeusername/',
  method: 'post',
  data: {
    id,
    username
  }
})
