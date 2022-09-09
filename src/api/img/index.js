import request from '@/utils/request'

export const uploadImg = (img) => request({ url: `/admin/media/img/`, method: 'post', data: img })
