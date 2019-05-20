// import http from "./http";

/**
 * 管理员登录
 * @param {String} account 邮箱/手机号
 * @param {String} password 密码
 */
export function login({ account, password }) {
  return new Promise((resolve, reject) => {
    if (account === "admin" && password === "admin") {
      resolve({
        code: 0,
        message: "登录成功！",
        data: { token: "xxxxxxxxxxxxxxxxxx" }
      });
    } else {
      reject({
        code: 402,
        message: "账户或密码错误!"
      });
    }
  });
}
