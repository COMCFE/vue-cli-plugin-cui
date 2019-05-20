<template lang="pug">
  .cui-page.page-login
    .login-wrapper
      header.cui-page-header
        h2.cui-brand <%= rootOptions.projectName %>
        ul.cui-intro
          li 这里写站点描述，20字左右
      main.cui-page-main
        h3.page-title 登录
        el-form(:model='dataForm', :rules='dataRule', ref='dataForm', @keyup.enter.native='dataFormSubmitHandle()')
          el-form-item(prop='account')
            el-input(v-model='dataForm.account', type="text", placeholder="邮箱/手机号码", prefix-icon='el-icon-user')
          el-form-item(prop='password')
            el-input(v-model='dataForm.password', type='password', placeholder="密码", prefix-icon='el-icon-unlock')
          el-form-item(:error='errorMsg')
          el-form-item
            el-button.w-100(type="primary", :disabled='!canSubmit', :loading='submitting', @click="dataFormSubmitHandle()") 登录
      footer.cui-footer.cui-page-footer
        p
          a(href='http://www.igoods.io', target='_blank') 链优科技
          | 2019 &copy; CHAINONE
</template>
<script>
import auth from "@/utils/auth";
export default {
  name: "page-login",
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
    dataFormSubmitHandle() {
      if (this.submitting) return;
      this.submitting = true;

      this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;

        setTimeout(() => {
          const data = {
            code: 0,
            token: "xxxxxxxxxxxxxxxxxx",
            message: "登录成功！"
          };

          if (data.code === 0) {
            auth.token = data.token;
            this.$message({
              duration: 1e3,
              type: "success",
              message: data.message,
              onClose: () => {
                this.submitting = false;
                this.$router.replace(
                  this.$route.query.redirect || {
                    name: this.$config.routeHomeName
                  }
                );
              }
            });
          }
        }, 1e3);
      });
    }
  }
};
</script>
