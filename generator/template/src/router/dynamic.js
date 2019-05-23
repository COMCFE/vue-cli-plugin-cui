/**
 * 通过请求获取远端路由列表
 * 也可以按照指定数据结构直接 resolve({ menus: [], perms: [] })
 */
export default () =>
  new Promise((resolve /* , reject */) => {
    resolve({
      menus: [
        {
          perms: "test",
          url: "/test-module",
          order: 0,
          id: 104,
          name: "测试页面",
          type: 1,
          icon: "",
          pid: 0,
          show: 1,
          list: null
        }
      ],
      perms: ["test"]
    });
  });
