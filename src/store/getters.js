const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  id: state => state.user.id,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  token: state => state.user.token,
  tRole: state => state.user.tRole,
  permission_routers: state => state.permission.routes
}
export default getters
