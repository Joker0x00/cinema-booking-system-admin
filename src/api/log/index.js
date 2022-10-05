import request from '@/utils/request'

export const get_log = (page, limit) => request({ url: `/admin/action/list/?page=${page}&limit=${limit}`, method: 'get' })
