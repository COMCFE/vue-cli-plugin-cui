export default [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: 'common-pages' */ "@/views/login"),
    meta: {
      auth: false,
      title: "登录"
    }
  },
  {
    path: "/401",
    name: "error_401",
    component: () =>
      import(/* webpackChunkName: 'common-pages' */ "@/views/error-page/401"),
    meta: {
      title: "401"
    }
  },
  {
    path: "404",
    name: "error_404",
    component: () =>
      import(/* webpackChunkName: 'common-pages' */ "@/views/error-page/404"),
    meta: {
      title: "404"
    }
  },
  {
    path: "/500",
    name: "error_500",
    component: () =>
      import(/* webpackChunkName: 'common-pages' */ "@/views/error-page/500"),
    meta: {
      title: "500"
    }
  }
];
