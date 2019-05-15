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
  auth.token && (config.headers["Authorization"] = auth.token);
}, Promise.reject);

/**
 * @description 拦截响应，统一处理非业务错误
 */
http.interceptors.response.use(
  res => res,
  error => {
    return Promise.reject(error);
  }
);

export default http;
