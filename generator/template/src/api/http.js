import axios from "axios";
import auth from "@/utils/auth";

/**
 * @description 创建实例 http
 */
const http = axios.create({
  timeout: 5 * 1e3, // 5s 超时
  baseURL: process.env.VUE_APP_API_PREFIX || "",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json; charset=utf-8"
  }
});

/**
 * @description 拦截请求，修改请求配置
 */
http.interceptors.request.use(config => {
  // 1. 注入 token
  auth.token && (config.headers.common["Authorization"] = auth.token);
}, Promise.reject);

/**
 * @description 拦截响应，统一处理非业务错误
 * @returns { code: ==0, message: '请求成功！', data: Object }
 * @returns { code: >=0, message: '请求失败！', data: Object }
 */
http.interceptors.response.use(
  // 直接返回后端数据
  res => {
    const { data } = res;
    return {
      data,
      code: 0,
      message: data.message || "请求成功！"
    };
  },
  error => {
    const err = {};

    if (!error.response) {
      const { status = 500, message = "网络错误！" } = error;
      err["code"] = status;
      err["message"] = message;
    } else {
      const { status, data } = error.response;
      const { message = "请求失败！" } = data;
      err["data"] = data;
      err["code"] = status;
      err["message"] = message;

      switch (status) {
        case 401:
          err["message"] = "登录失效";
          auth.logout("登录失效，是否前往登录页重新登录？", "重新登录", {
            confirmButtonText: "重新登录",
            showCancelButton: false
          });
      }
    }

    return Promise.reject(err);
  }
);

export default http;
