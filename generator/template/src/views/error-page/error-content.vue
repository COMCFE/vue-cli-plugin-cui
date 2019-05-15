<template lang="pug">
  .error-page
    .content-con
      img(:src='src', :alt='code')
      .text-con
        h4 {{ code }}
        h5 {{ desc }}
      back-btn-group.back-btn-group

</template>

<script>
import backBtnGroup from "./back-btn-group";
export default {
  name: "error_content",
  components: {
    backBtnGroup
  },
  props: {
    code: String,
    desc: String,
    src: String
  }
};
</script>
