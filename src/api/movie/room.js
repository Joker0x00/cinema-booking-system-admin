import request from '@/utils/request'
// 获取放映厅信息
export const reqRoomList = (page, size = 10, vague = false, searchParams = '') => request({
  url: `/admin/room/list/?page=${page}&limit=${size}&vague=${vague}&searchParams=${searchParams}`,
  method: 'get'
})

export const addRoom = (form) => request({
  url: `/admin/room/list/`,
  method: 'post',
  data: {
    form
  }
})

export const editRoom = (form) => request({
  url: `/admin/room/list/`,
  method: 'put',
  data: {
    form
  }
})

export const deleteRoom = (id) => request({
  url: `/admin/room/list/`,
  method: 'delete',
  data: {
    id
  }
})

export const reqRoomAll = () => request({
  url: `/admin/room/all/`,
  method: 'get'
})

export const reqRoomCanChoose = (movie_id = '') => request({
  url: `/admin/room/detail/?movie_id=${movie_id}`,
  method: 'get'
})
