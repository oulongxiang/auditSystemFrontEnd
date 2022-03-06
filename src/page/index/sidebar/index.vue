<template>
    <el-scrollbar
        class="avue-menu"
        v-if="reload">
        <div
            v-if="(validatenull(getPcMenu())&&!isHorizontal)"
            class="avue-sidebar--tip">没有发现菜单</div>
        <el-menu
            unique-opened
            :default-active="nowTagValue"
            :mode="setting.sidebar"
            :collapse="keyCollapse">
            <sidebar-item
                :menu="getPcMenu()"
                :screen="screen"
                first
                :props="website.menu.props"
                :collapse="keyCollapse"/>
        </el-menu>
    </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import sidebarItem from "./sidebarItem";

export default {
  name: "Sidebar",
  components: { sidebarItem },
  inject: ["index"],
  data() {
    return {
      reload: true
    };
  },
  created() {
    this.index.openMenu();
  },
  watch: {
    isHorizontal() {
      this.reload = false;
      this.$nextTick(() => {
        this.reload = true;
      });
    }
  },
  computed: {
    ...mapGetters(["isHorizontal", "setting", "website", "menu", "tag", "keyCollapse", "screen", "menuId", "onlyPage"]),
    nowTagValue: function() {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  methods: {
    getPcMenu() {
      const result = [];
      for (const item of this.menu) {
        if (!item.meta.isMobile) {
          result.push(item);
        }
      }
      return result;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

