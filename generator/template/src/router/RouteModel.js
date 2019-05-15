import { isUrl } from "@/utils";

export default class RouteModel {
  path = "";
  name = "";
  component = null;

  meta = {
    id: null,
    title: "",
    auth: true,
    isTab: true,
    isDynamic: true,
    iframeUrl: ""
  };

  constructor(options = {}) {
    const { url, name, id } = options;
    this.meta.id = id;
    this.meta.title = name;

    if (isUrl(url)) {
      this.path = this.name = `ifr-${id}`;
      this.meta.iframeUrl = url;
    } else {
      this.path = url.replace(/^\//, "");
      this.name = this.path.replace("/", "-");
      try {
        this.component = () =>
          import(
            /* webpackPrefetch: true */
            /* webpackPreload: true */
            /* webpackMode: "lazy-once" */
            /* webpackChunkName: "dynamic" */ `@/views/modules/${this.path}`
          );
      } catch ({ message = "模块加载失败" }) {
        this.component = null;
      }
    }
  }
}
