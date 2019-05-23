/**
 * @description 页面布局框架相关配置项
 */
export default {
  namespaced: true,
  state: {
    // 侧边, 折叠状态
    asideFold: false,
    // 侧边栏, 菜单
    asideMenuList: [],
    // 侧边, 菜单选中
    asideMenuActive: ""
  },
  mutations: {
    updateAsideFold(state, status) {
      state.asideFold = status;
    },
    updateAsideMenuList(state, status) {
      state.asideMenuList = status;
    },
    updateAsideMenuActive(state, status) {
      state.asideMenuActive = status;
    }
  }
};
