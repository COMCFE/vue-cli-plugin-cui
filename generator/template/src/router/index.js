/**
 * 路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from "vue";
import Router from "vue-router";
import auth from "@/utils/auth";
import storage from "@/utils/storage";
import { requireAuth } from "./utils";
import {
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_DYNAMIC_MARK,
  SESSION_MENUS,
  SESSION_PERMS
} from "@/config";

/**
 * @description 基础路由
 * 包含以下页面：
 * *登录|注册|401|500*
 */
import common from "./common";
import getDynamicRoutes from "./dynamic";
import RouteModel from "./RouteModel";

Vue.use(Router);

const main = {
  path: "/",
  redirect: { name: ROUTE_LOGIN },
  component: () => import(/* webpackChunkName: 'dynamic' */ "@/layout"),
  children: []
};

const router = new Router({
  mode: "hash",
  base: process.env.VUE_APP_BASEURL,
  [ROUTE_DYNAMIC_MARK]: false, // 是否已经添加动态(菜单)路由
  routes: common
});

router.beforeEach((to, from, next) => {
  /** 1. 判断是否登录 */
  // 1.1 未登录
  if (!auth.token) {
    requireAuth(to)
      ? next({ name: ROUTE_LOGIN, query: { redirect: to.fullPath } })
      : next();
  }
  // 1.2 已登录
  else {
    /** 2. 判断是否注册动态路由 */
    // 2.1 已注册动态路由
    if (router.options[ROUTE_DYNAMIC_MARK]) {
      requireAuth(to) ? next() : next({ name: ROUTE_HOME });
    }
    // 2.2 未注册动态路由
    else {
      injectDynamicRoutes().then(({ menus, perms, dynamic }) => {
        // 首页
        const home = {
          path: ROUTE_HOME,
          name: ROUTE_HOME,
          component: () =>
            import(/* webpackChunkName: 'dynamic' */ "@/views/home")
        };
        // 通配符必须在动态路由注册成功后添加，否则其后的路由无法被匹配
        const _404 = { path: "*", redirect: "/401" };

        main.children = [...dynamic, home];
        router.addRoutes([main, _404]);
        router.options[ROUTE_DYNAMIC_MARK] = true;

        // 本地存储
        storage
          .write(SESSION_MENUS, menus, true)
          .write(SESSION_PERMS, perms, true);

        requireAuth(to) ? next({ name: ROUTE_HOME }) : next();
      });
    }
  }
});

/**
 * 注册动态路由
 */
async function injectDynamicRoutes() {
  /** 1. 拉取动态路由列表 */
  const { menus, perms } = await getDynamicRoutes();
  return { menus, perms, dynamic: generateRoutes(menus) };
}

/**
 * 构造路由列表
 * @param {Array} list 数据列表
 * @param {Array} acc 路由列表
 */
function generateRoutes(list, acc = []) {
  let temp = [];

  list.forEach(item => {
    const { list: children } = item;
    // 追加 children
    if (Array.isArray(children) && children.length) {
      temp = [...temp, ...children];
    } else {
      const route = new RouteModel(item);
      acc.push(route);
    }
  });

  temp.length && generateRoutes(temp, acc);

  return acc;
}

export default router;
