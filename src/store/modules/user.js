import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    login: false,
    roles: [],
    tRole: '',
    sex: '',
    phone_number: '',
    balance: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, roles) => {
    state.roles = roles
  },
  SET_TROLE: (state, role) => {
    state.tRole = role
  },
  SET_PHONENUMBER: (state, phone_number) => {
    state.phone_number = phone_number
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
  },
  SET_BALANCE: (state, balance) => {
    state.balance = balance
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password, isAdmin, code_id, code } = userInfo
    const result = await login({ username: username.trim(), password: password, isAdmin: isAdmin, code_id, code })
    // console.log(result)
    if (result.code === 200) {
      commit('SET_TOKEN', result.data.token) // 保存在vuex中
      setToken(result.data.token) // 保存在本地
      commit('SET_TROLE', result.data.role)
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token, state.tRole).then(response => {
        const { data } = response
        if (!data) {
          return reject('验证失败，请重新登录')
        }
        console.log(data)

        const { id, name, avatar, roles, sex, phone_number, balance } = data
        commit('SET_ID', id)
        commit('SET_NAME', name)
        commit('SET_ROLE', roles)
        commit('SET_AVATAR', avatar)
        commit('SET_SEX', sex)
        commit('SET_PHONENUMBER', phone_number)
        commit('SET_BALANCE', balance)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

