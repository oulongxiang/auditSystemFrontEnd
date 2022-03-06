<template>
  <div  class="avue-contail"
       :class="{'avue--collapse':isCollapse,}">
    <screenshot v-if="setting.screenshot && isShowMenu()"></screenshot>

    <div class="avue-layout"
         :class="{'avue-layout--horizontal':isHorizontal}">
      <div v-if="isShowMenu()" class="avue-sidebar">
        <!-- 左侧导航栏 -->
        <logo />
        <sidebar />
      </div>
      <div class="avue-main">
        <!-- 顶部导航栏 -->
        <top v-if="isShowMenu()" ref="top" />
        <!-- 顶部标签卡 -->
        <tags v-if="isShowMenu()" />
        <transition name="fade-scale">
          <search class="avue-view"
                  v-show="isSearch"></search>
        </transition>
        <!-- 主体视图层 -->
        <div style="flex:auto;overflow-y:auto;overflow-x:hidden;"
             id="avue-view"
             v-show="!isSearch">
          <keep-alive >
            <router-view class="avue-view"
                         v-if="$route.meta.keepAlive && isRefresh" />
          </keep-alive>
          <router-view class="avue-view"
                       v-if="!$route.meta.keepAlive && isRefresh" />
        </div>
<!--        <div class="avue-footer">-->
<!--          <p class="copyright">Copyright@2017 联邦制药 版板所有 香港交易所股票代码：03933</p>-->
<!--        </div>-->
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tags from "./tags";
import screenshot from "./screenshot";
import setting from "./setting";
import search from "./search";
import logo from "./logo";
import top from "./top/";
import sidebar from "./sidebar/";
import admin from "@/util/admin";
import { validatenull } from "@/util/validate";

export default {
  components: {
    top,
    logo,
    tags,
    search,
    sidebar,
    setting,
    screenshot
  },
  name: "index",
  provide () {
    return {
      index: this
    };
  },
  data () {
    return {
      //搜索控制
      isSearch: false,
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: ""
    };
  },
  mounted () {
    this.init();
    this.isShowMenu()
  },
  computed: mapGetters(["isHorizontal", "setting", "isRefresh", "isLock", "isCollapse", "website", "menu","onlyPage"]),
  props: [],
  methods: {
    // 屏幕检测
    init () {
      this.$store.commit("SET_SCREEN", admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen());
        }, 0);
      };
    },
    isShowMenu(isSetting=false){
      // true-移动端 false-PC端
      let isMobile= !!this.$route.meta.isMobile
      // true-仅页面 false-全显示
      let isOnlyPage=!!this.$store.getters.setting.onlyPage
      if(isSetting){
        return !isMobile
      }
      return !isMobile && !isOnlyPage
    },
    //打开菜单
    openMenu (item = {}) {
      this.$store.dispatch("GetMenu", item.parentId).then(data => {
        if (data.length !== 0) {
          this.$router.$avueRouter.formatRoutes(data, true);
        }
        //当点击顶部菜单做的事件
        if (!validatenull(item)) {
          let itemActive = {},
            childItemActive = 0;
          //vue-router路由
          if (item.path) {
            itemActive = item;
          } else {
            if (this.menu[childItemActive].length === 0) {
              itemActive = this.menu[childItemActive];
            } else {
              itemActive = this.menu[childItemActive].children[childItemActive];
            }
          }
          this.$store.commit('SET_MENUID', item);
          this.$router.push({
            path: this.$router.$avueRouter.getPath({
              name: itemActive.label,
              src: itemActive.path
            }, itemActive.meta)
          });
        }

      });
    },
  }
};
</script>
