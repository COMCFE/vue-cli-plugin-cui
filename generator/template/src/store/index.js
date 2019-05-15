import Vue from "vue";
import Vuex from "vuex";
import layout from "./modules/layout";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layout
  },
  // 生产环境下关闭严格模式，以避免性能损失。
  strict: process.env.NODE_ENV !== "production"
});
