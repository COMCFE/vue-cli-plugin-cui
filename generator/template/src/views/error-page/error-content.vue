<template lang="pug">
  .page-error
    .error__content
      img(:src='src', :alt='code')
      .error__text
        h4 {{ code }}
        h5 {{ desc }}
      back-btn-group.error__btn-group

</template>

<script>
import backBtnGroup from "./back-btn-group";
import "./error.scss";

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
