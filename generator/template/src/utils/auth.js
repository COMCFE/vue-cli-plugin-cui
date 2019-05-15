import storage from "./storage";
import { SESSION_TOKEN } from "@/config";

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
   * @description 用户登出操作时，清空 token
   */
  logout() {
    this.token = "";
  }
}

export default new Auth();
