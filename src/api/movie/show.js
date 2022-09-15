import request from '@/utils/request'
// 获取放映厅信息
export const reqShowList = (page, size = 10, vague = false, searchParams = '') => request({
  url: `/admin/show/list/?page=${page}&limit=${size}&vague=${vague}&searchParams=${searchParams}`,
  method: 'get'
})

export const addShow = (form) => request({
  url: `/admin/show/list/`,
  method: 'post',
  data: {
    form
  }
})

export const editShow = (form) => request({
  url: `/admin/show/list/`,
  method: 'put',
  data: {
    form
  }
})

export const deleteShow = (id) => request({
  url: `/admin/show/list/`,
  method: 'delete',
  data: {
    id
  }
})

export const reqShowCanChoose = (movie_id = '', room_id = '') => request({
  url: `/admin/show/detail/?movie_id=${movie_id}&room_id=${room_id}`,
  method: 'get'
})

export const reqSeatLayout = (show_id = '') => request({
  url: `/admin/show/detail/?show_id=${show_id}`,
  method: 'get'
})

export const getAllShow = (movie_id = '') => request({
  url: `/admin/show/user_get/?movie_id=${movie_id}`,
  method: 'get'
})
