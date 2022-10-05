// 集中暴露
import * as movieDetail from './movie/movieDetail'
import * as room from './movie/room'
import * as show from './movie/show'
import * as img from './img/'
import * as reqExport from './export/'
import * as user from './user/user'
import * as admin from './user/admin'
import * as order from './order/index'
import * as comment from './comment/index'
import * as log from './log/index'
// 对外暴露
export default {
  movieDetail,
  room,
  show,
  img,
  reqExport,
  user,
  admin,
  order,
  comment,
  log
}
