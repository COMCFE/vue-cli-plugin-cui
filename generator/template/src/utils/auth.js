import router from "@/router";
import storage from "./storage";
import { noop } from "@/utils";
import { login } from "@/api/auth";
import { MessageBox } from "element-ui";
import { SESSION_TOKEN, ROUTE_LOGIN } from "@/config";

class Auth {
  constructor() {}

  get token() {
    return storage.read(SESSION_TOKEN, true);
  }

  set token(val) {
    return val
      ? storage.write(SESSION_TOKEN, val, true)
      : storage.remove(SESSION_TOKEN, true);
  }

  /**
   * @description 用户登录
   */
  login(param) {
    return login(param)
      .then(
        ({
          message: defaultMsg = "登录成功！",
          data: { message = defaultMsg, token }
        }) => {
          this.token = token;
          return message;
        }
      )
      .catch(
        ({
          message: defaultMsg = "登录失败！",
          data: { message } = { message: defaultMsg }
        }) => Promise.reject(message)
      );
  }

  /**
   * @description 用户登出操作时，清空 token
   */
  logout(message = "确认退出当前登录账户？", title = "确认登出", options) {
    MessageBox.confirm(message, title, {
      type: "warning",
      ...options
    })
      .then(() => {
        this.token = "";
        router.push({ name: ROUTE_LOGIN });
      })
      .catch(noop);
  }
}

export default new Auth();
