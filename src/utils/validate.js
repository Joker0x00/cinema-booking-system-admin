/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 验证用户名是否合法
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return /^\w{3,20}$/.test(str)
}

export function validBalance(str) {
  return /^(0|[1-9]){1,5}(\.[0-9]{1,2})?$/.test(str)
}

export function validPhoneNumber(str) {
  return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(str)
}

export function validPassword(str) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/.test(str)
}
