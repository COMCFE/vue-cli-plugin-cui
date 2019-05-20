/**
 * @description 空函数
 */
export const noop = () => {};

/**
 * 判断是否为绝对路径
 * @param {String} str 待验证字段
 */
export function isUrl(str) {
  return /^([a-z][a-z\d+-.]*:)?\/\//i.test(str);
}
