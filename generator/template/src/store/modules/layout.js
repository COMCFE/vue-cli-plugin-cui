/**
 * @description 页面布局框架相关配置项
 */
export default {
  namespaced: true,
  state: {
    assideFold: false
  },
  mutations: {
    updateAssideFold(state, status) {
      state.assideFold = status;
    }
  }
};
