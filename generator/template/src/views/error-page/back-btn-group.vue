<template lang="pug">
  el-button-group
    el-button(size='large', type='text', @click='backHomeHandle()') 返回首页
    el-button(size='large', type='text', @click='backPrevHandle()') 返回上一页({{ second }}s)

</template>

<script>
export default {
  name: "backBtnGroup",
  data() {
    return {
      second: 5,
      timer: null
    };
  },
  methods: {
    backHomeHandle() {
      this.$router.replace({ name: this.$config.routeHomeName });
    },
    backPrevHandle() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.second === 0) this.backPrevHandle();
      else this.second--;
    }, 1000);
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  }
};
</script>
