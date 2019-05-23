<template lang="pug">
  //- 多栏目且存在多个子栏目
  el-submenu(v-if='subMenus && subMenus.length > 1', :index='menuIndex', :popper-append-to-body="false")
    template(slot="title")
      svg-icon.el-icon--xxx(v-if='menu.icon', :name='menu.icon')
      i.el-icon--xxx(v-else) {{ menu.name[0].toUpperCase() }}
    cui-menu-item(:menu='subMenu', :key='subMenu.id', v-for='subMenu in subMenus')

  //- 单个子栏目
  cui-menu-item(v-else-if='subMenus && subMenus.length === 1', :menu='subMenus[0]')

  //- 单栏目
  el-menu-item(v-else, :index='menuIndex', @click="gotoRouteHandle(menu)")
    svg-icon.el-icon--xxx(v-if='menu.icon', :name='menu.icon')
    i.el-icon--xxx(v-else) {{ menu.name[0].toUpperCase() }}
    span(slot='title') {{ menu.name }}

</template>
<script>
export default {
  name: "cuiMenuItem",
  inject: ["gotoRouteHandle"],
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  computed: {
    menuIndex() {
      const { name, id } = this.menu;
      return `${name}#${id}`;
    },
    subMenus() {
      const { list = [] } = this.menu;
      return list ? list.filter(m => m.show) : [];
    }
  }
};
</script>
