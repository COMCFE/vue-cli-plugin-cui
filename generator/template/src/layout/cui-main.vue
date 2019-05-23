<template lang="pug">
  main.cui-main
    template(v-if='isIframe')
      iframe.cui-main__iframe(frameborder='0', scrolling='yes', :src='$route.meta.iframeUrl')
    keep-alive(v-else)
      router-view
</template>
<script>
export default {
  name: "cuiMain",
  computed: {
    isIframe() {
      const { meta } = this.$route;
      return meta && meta.isIframe;
    }
  }
};
</script>
