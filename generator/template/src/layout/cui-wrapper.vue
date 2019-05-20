<template lang="pug">
  .cui-wrapper(v-cloak, ref='cui-wrapper', v-loading.fullscreen.lock="loading", :class='wrapperClassNames')
    //- 页眉
    cui-header
    //- 侧边栏
    cui-aside
    //- 内容区
    cui-main
    //- 页脚
    cui-footer
</template>
<script>
import cuiMain from "./cui-main";
import cuiAside from "./cui-aside";
import cuiHeader from "./cui-header";
import cuiFooter from "./cui-footer";

import { mapState } from "vuex";

export default {
  name: "cuiWrapper",
  components: {
    cuiMain,
    cuiAside,
    cuiHeader,
    cuiFooter
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState("layout", ["assideFold"]),
    wrapperClassNames() {
      return {
        "cui-aside--fold": this.assideFold
      };
    }
  }
};
</script>
