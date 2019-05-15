<template lang="pug">
  .layout-wrapper(v-cloak, ref='layout-wrapper', v-loading.fullscreen.lock="loading")
    //- 页眉
    layout-header
    //- 侧边栏
    layout-aside
    //- 内容区
    layout-main
    //- 页脚
    layout-footer
</template>
<script>
import layoutMain from "./layout-main";
import layoutAside from "./layout-aside";
import layoutHeader from "./layout-header";
import layoutFooter from "./layout-footer";

export default {
  name: "layoutWrapper",
  components: {
    layoutMain,
    layoutAside,
    layoutHeader,
    layoutFooter
  },
  data() {
    return {
      loading: false
    };
  }
};
</script>

