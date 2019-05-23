<template lang="pug">
svg(:width='width', :height='height', :class="className", aria-hidden="true")
  use(:xlink:href="__name__")
</template>
<script>
export default {
  name: "svg-icon",
  props: {
    name: {
      type: String,
      required: true
    },
    width: String,
    height: String
  },
  computed: {
    __name__() {
      return `#icon-${this.name}`;
    },
    className() {
      return ["svg-icon", `svg-icon__${this.name}`];
    }
  }
};
</script>
