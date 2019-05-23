<template lang="pug">
  .cui-page.page-login
    .login-wrapper
      header.cui-page-header
        h2.cui-brand test
        ul.cui-intro
          li 这里写站点描述，20字左右
      main.cui-page-main
        h3.page-title 登录
        el-form(:model='dataForm', :rules='dataRule', ref='dataForm', @keyup.enter.native='dataFormSubmitHandle()')
          el-form-item(prop='account')
            el-input(v-model='dataForm.account', type="text", @focus="clearErrorHandle()", placeholder="邮箱/手机号码", prefix-icon='el-icon-user')
          el-form-item(prop='password')
            el-input(v-model='dataForm.password', type='password', @focus='[clearErrorHandle(), clearFormHandle("password")]', placeholder="密码", prefix-icon='el-icon-unlock')
          el-form-item.login__submit-btn(:error='errorMsg')
            el-button.w-100(type="primary", :disabled='!canSubmit', :loading='submitting', @click="dataFormSubmitHandle()") 登录
      cui-footer.cui-page-footer
</template>
<script>
import auth from "@/utils/auth";
import cuiFooter from "@/layout/cui-footer";
export default {
  name: "page-login",
  components: {
    cuiFooter
  },
  data() {
    return {
      dataForm: {
        account: "",
        password: ""
      },
      dataRule: {
        account: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ]
      },
      errorMsg: "",
      submitting: false
    };
  },
  computed: {
    canSubmit() {
      return this.dataForm.account && this.dataForm.password;
    }
  },
  methods: {
    clearFormHandle(key) {
      key ? (this.dataForm[key] = "") : this.$refs["dataForm"].resetFields();
    },

    clearErrorHandle() {
      this.errorMsg = "";
    },
    dataFormSubmitHandle() {
      if (this.submitting) return;
      this.submitting = true;

      this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;

        auth
          .login(this.dataForm)
          .then(message => {
            this.$message({
              message,
              duration: 1e3,
              type: "success",
              onClose: () => {
                const next = this.$route.query.redirect || {
                  name: this.$config.routeHomeName
                };
                this.$router.replace(next);

                this.submitting = false;
              }
            });
          })
          .catch(error => {
            this.errorMsg = error;
            this.submitting = false;
          });
      });
    }
  }
};
</script>
