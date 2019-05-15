import Vue from "vue";
import App from "./App.vue";
import config from "@/config";
import "@/styles/index.scss"; // 全局样式
import "@/plugins/element";

Vue.config.productionTip = false; // 生产环境关掉提示
Vue.prototype.$config = config; //全局注册应用配置

new Vue({
  render: h => h(App)
}).$mount("#app");
