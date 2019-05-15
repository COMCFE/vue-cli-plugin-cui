const path = require("path");

const isProd = process.env.NODE_ENV === "production";
const gzipEnable = JSON.parse(process.env.VUE_APP_GZIP);
const prodMapEnable = JSON.parse(process.env.VUE_APP_SOURCE_MAP);
const publicPath = process.env.VUE_APP_BASEURL;

/**
 * 拼接资源路径
 * @param {String} url 相对路径
 */
const combineProdURLs = url => {
  return url
    ? publicPath.replace(/\/+$/, "") + "/" + url.replace(/^\/+/, "")
    : publicPath;
};

/**
 * @description 外部库， CDN 配置
 */
const externals = {
  axios: "axios",
  vue: "Vue",
  vuex: "Vuex",
  "vue-router": "VueRouter",
  "element-ui": "ELEMENT"
};

const cdn = {
  js: [
    "https://unpkg.com/vue@2.6.10/dist/vue.min.js",
    "https://unpkg.com/vue-router@3.0.2/dist/vue-router.min.js",
    "https://unpkg.com/vuex@3.0.1/dist/vuex.min.js",
    "https://unpkg.com/axios@0.18.0/dist/axios.min.js",
    "https://unpkg.com/element-ui@2.8.2/lib/index.js"
  ],
  css: [
    //
    // Element-ui 默认主题
    //
    // 若需要自定义element主题，
    // 1. 将生成的主题文件(夹)放至`./plublic/css`目录下，如：`element-7c4dff/`
    // 2. 注释后面这句代码，打开`plugins.css`中的注释
    //
    "https://unpkg.com/element-ui@2.8.2/lib/theme-chalk/index.css"
  ]
};

// 第三方插件、自定义文件类(js/css)
const plugins = {
  js: [].map(combineProdURLs),
  css: [
    // // 自定义主题文件
    // "css/element-7c4dff/index.css"
  ].map(combineProdURLs)
};

module.exports = {
  publicPath,

  /**
   * @description 生产环境下是否生成 map 文件
   * @default false
   */
  productionSourceMap: prodMapEnable,

  css: {
    loaderOptions: {
      /**
       * @description 注入 scss 全局变量
       */
      sass: {
        data: `@import "@/styles/variables.scss";`
      }
    }
  },

  chainWebpack: config => {
    // 添加 gzip 插件
    if (gzipEnable) {
      config.plugin("compression").use(require("compression-webpack-plugin"), [
        {
          test: /\.(js|css)$/,
          threshold: 8192,
          minRatio: 0.8
        }
      ]);
    }

    // 注入 cdn, plugins
    config.plugin("html").tap(args => {
      // 开发时无需使用 CDN
      args[0].cdn = isProd ? cdn : {};

      args[0].plugins = plugins;
      return args;
    });

    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    const svgRule = config.module.rule("svg");
    const svgDir = path.resolve(__dirname, "./src", "icons");
    svgRule.uses.clear();

    // add replacement loader(s)
    svgRule.include
      .add(svgDir)
      .end()
      .exclude.add(/node_modules/)
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({ symbolId: "icon-[name]" });

    // 修改images loader 添加svg处理
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .exclude.add(svgDir)
      .end();

    // 配置 外部库
    config.externals(isProd ? externals : undefined);
  }
};
