import { isUrl } from "@/utils";

export default class RouteModel {
  path = "";
  name = "";
  component = null;
  compiled = false;
  isIframe = false;

  meta = {
    id: null,
    title: "",
    auth: true,
    isDynamic: true,
    isIframe: false,
    iframeUrl: ""
  };

  constructor(options = {}) {
    const { url, name, id } = options;

    this.meta.id = id;
    this.meta.title = name;

    const isIframe = isUrl(url);
    this.isIframe = this.meta.isIframe = isIframe;

    if (isIframe) {
      this.compiled = true;
      this.path = this.name = `ifr-${id}`;
      this.meta.iframeUrl = url;
    } else {
      this.path = url.replace(/^\//, "");
      this.name = this.path.replace("/", "-");
    }
  }

  async injectComponent() {
    if (this.compiled) return this;

    try {
      const component = await import(
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        /* webpackMode: "lazy-once" */
        /* webpackChunkName: "dynamic" */ `@/views/modules/${this.path}`
      );

      this.component = component.default;
      this.compiled = true;
    } catch {
      // 模块不存在
    }

    return this;
  }
}
