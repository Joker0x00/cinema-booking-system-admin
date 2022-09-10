import request from '@/utils/request'

export const uploadImg = (img) => request({ url: `/admin/media/img/`, method: 'post', data: img })

export const getConfirmCode = () => request({
  url: '/media/code_img/',
  method: 'get'
})
