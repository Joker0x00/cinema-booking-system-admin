import request from '@/utils/request'
// 获取电影分页数据
export const reqMovieList = (page, limit = 10, vague = false, searchParams = '') => request({
  url: `/admin/movie/list/?page=${page}&limit=${limit}&vague=${vague}&searchParams=${searchParams}`,
  method: 'get'
})

// 获取所有电影类型
export const reqMovieType = (key = '') => request({
  url: `/admin/movie_type/list/?key=${key}`,
  method: 'get'
})
// 新增电影
export const addMovie = (form) => request({
  url: '/admin/movie/list/',
  method: 'post',
  data: {
    form
  }
})
// 编辑电影
export const editMovie = (form) => request({
  url: '/admin/movie/list/',
  method: 'put',
  data: {
    form
  }
})
// 删除某一部电影
export const deleteMovie = (id) => request({
  url: '/admin/movie/list/',
  method: 'delete',
  data: {
    id
  }
})
// 获取所有电影
export const reqMovieAll = () => request({
  url: '/admin/movie/all/',
  method: 'get'
})

// 处理电影类型
// 新增电影类型
export const addMovieType = (form) => request({
  url: '/admin/movie_type/list/',
  method: 'post',
  data: {
    form
  }
})
// 编辑电影类型
export const editMovieType = (form) => request({
  url: '/admin/movie_type/list/',
  method: 'put',
  data: {
    form
  }
})
// 删除某一个电影类型
export const deleteMovieType = (id) => request({
  url: '/admin/movie_type/list/',
  method: 'delete',
  data: {
    id
  }
})
