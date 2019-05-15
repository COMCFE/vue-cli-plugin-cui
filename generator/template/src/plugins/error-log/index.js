import Vue from "vue";

Vue.config.errorHandler = (error /* , vm, mes */) => {
  let info = {
    type: "script",
    code: 0,
    mes: error.message,
    url: window.location.href
  };

  Vue.nextTick(() => {
    console.table(info);
  });
};
