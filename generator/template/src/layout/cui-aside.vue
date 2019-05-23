<template lang="pug">
  aside.cui-aside
    .cui-aside__hd
      router-link.cui-brand(:to="{ name: $config.routeHomeName }")
        span.cui-brand--lg 链优科技
        span.cui-brand--sm 链优
    .cui-aside__bd
      .cui-aside__menu-wrapper
        el-menu.cui-aside__menu(
          :unique-opened='true',
          :collapse='asideFold',
          :collapse-transition='false'
          :default-active='asideMenuActive'
        )
          cui-menu-item(:menu='menu', v-for='menu in asideMenuList' :key='menu.id')
    .cui-aside__tool(@click='updateAsideFold(!asideFold)')
      .cui-aside__tool-bg
      .cui-aside__tool-btn
        svg-icon(name='outdent')
</template>
<script>
import cuiMenuItem from "./cui-menu-item";
import { mapState, mapMutations } from "vuex";
import storage from "@/utils/storage";
import { SESSION_MENUS, SESSION_ROUTES } from "@/config";
export default {
  name: "cuiAside",
  provide() {
    return {
      gotoRouteHandle: this.gotoRouteHandle
    };
  },
  data() {
    return {
      dynamicMenuRoutes: []
    };
  },
  components: {
    cuiMenuItem
  },
  computed: {
    ...mapState("layout", ["asideFold"]),
    asideMenuList: {
      get() {
        const asideMenuList = this.$store.state.layout.asideMenuList;
        // 筛选侧边栏
        return asideMenuList.filter(m => m.show && m.compiled);
      },
      set(val) {
        this.$store.commit("layout/updateAsideMenuList", val);
      }
    },
    asideMenuActive: {
      get() {
        return this.$store.state.layout.asideMenuActive;
      },
      set(menuName) {
        this.$store.commit("layout/updateAsideMenuActive", menuName);
      }
    }
  },
  watch: {
    $route: "routeChangeHandle"
  },
  methods: {
    ...mapMutations("layout", ["updateAsideFold"]),

    routeChangeHandle(route) {
      const { meta } = route;
      this.asideMenuActive = meta ? `${meta.title}#${meta.id}` : "home";
    },

    gotoRouteHandle(menu) {
      const route = this.dynamicMenuRoutes.filter(
        item => item.meta.id === menu.id
      );
      route.length && this.$router.push({ name: route[0].name });
    }
  },
  created() {
    this.asideMenuList = storage.read(SESSION_MENUS, true) || [];
    this.dynamicMenuRoutes = storage.read(SESSION_ROUTES, true) || [];
    this.routeChangeHandle(this.$route);
  }
};
</script>
