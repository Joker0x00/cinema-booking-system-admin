import request from '@/utils/request'

export function login(data) {
  return request({
    url: `/admin/user/login/`,
    method: 'post',
    data
  })
}

export function getInfo(token, role) {
  return request({
    url: `/admin/user/info/`,
    method: 'get',
    params: { token, role }
  })
}

export function logout() {
  return request({
    url: '/admin/user/logout/',
    method: 'post',
    data: {
      username: 'sdf'
    }
  })
}
