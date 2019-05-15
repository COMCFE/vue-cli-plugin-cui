export default [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: 'common-pages' */ "@/views/login")
  },
  {
    path: "/401",
    name: "error_401",
    component: () =>
      import(/* webpackChunkName: 'common-pages' */ "@/views/error-page/401")
  },
  {
    path: "404",
    name: "error_404",
    component: () =>
      import(/* webpackChunkName: 'common-pages' */ "@/views/error-page/404")
  },
  {
    path: "/500",
    name: "error_500",
    component: () =>
      import(/* webpackChunkName: 'common-pages' */ "@/views/error-page/500")
  }
];
