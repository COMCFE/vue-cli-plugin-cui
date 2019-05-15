module.exports = (api, options /* , rootOptions */) => {
  api.extendPackage({
    scripts: {
      commit: "git-cz",
      release: "node scripts/deploy.js"
    },
    dependencies: {
      axios: "^0.18.0",
      "element-ui": "^2.8.2",
      "vue-router": "^3.0.1",
      vuex: "^3.0.1"
    },
    devDependencies: {
      commitizen: "^3.0.5",
      "compression-webpack-plugin": "^2.0.0",
      "conventional-changelog": "^3.0.5",
      "cz-conventional-changelog": "^2.1.0",
      "lint-staged": "^8.1.0",
      scp2: "^0.5.0",
      "svg-sprite-loader": "^4.1.3"
    }
  });

  // 删除多余文件
  const filesToDelete = [
    "src/router.js",
    "src/store.js",
    "src/views/Home.vue",
    "src/views/About.vue",
    "src/components/HelloWorld.vue"
  ];
  api.render(files => {
    Object.keys(files)
      .filter(name => filesToDelete.indexOf(name) > -1)
      .forEach(name => delete files[name]);
  });

  api.render("./template");
};
