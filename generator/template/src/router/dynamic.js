/**
 * 拉取远端路由列表
 * 也可以按照指定数据结构直接 resolve({ menus: [], perms: [] })
 */
export default () =>
  new Promise((resolve /* , reject */) => {
    resolve({
      menus: [
        {
          id: 1,
          icon: "test",
          list: null,
          name: "测试页面",
          order: 1,
          perms: "",
          pid: 0,
          show: 1,
          type: 1,
          url: "/test-module"
        }
      ],
      perms: ["test"]
    });
  });
