/**
 * 判断当前路由是否登录可见
 * @param {Object} route 路由实例对象
 */
export function requireAuth(route) {
  if (!route) return false;
  const { auth = true } = route.meta || {};
  return auth;
}
