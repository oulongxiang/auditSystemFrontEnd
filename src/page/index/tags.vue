<template>
    <div
        class="avue-tags"
        v-if="setting.tag"
        @click="contextmenuFlag=false">
        <!-- tag盒子 -->
        <div
            v-if="contextmenuFlag"
            class="avue-tags__contentmenu"
            :style="{left:contentmenuX+'px',top:contentmenuY+'px'}">
            <div
                class="item"
                @click="closeOthersTags">关闭其它</div>
            <div
                class="item"
                @click="closeAllTags">关闭所有</div>
        </div>
        <div
            class="avue-tags__box"
            :class="{'avue-tags__box--close':!website.isFirstPage}">
            <el-tabs
                v-model="active"
                type="card"
                @contextmenu.native="handleContextmenu"
                :closable="tagLen!==1"
                @tab-click="openTag"
                @edit="menuTag">
                <el-tab-pane
                    :key="item.value"
                    v-for="item in tagList"
                    :label="generateTitle(item)"
                    :name="item.value">
                    <span slot="label">
                        {{ generateTitle(item) }}
                        <i
                            class="el-icon-refresh"
                            :class="{'turn':refresh}"
                            @click="handleRefresh"
                            v-if="active==item.value"/>
                    </span>
                </el-tab-pane>

            </el-tabs>
            <el-dropdown class="avue-tags__menu">
                <el-button
                    type="primary"
                    size="mini">
                    更多
                    <i class="el-icon-arrow-down el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="$parent.isSearch=true">搜索</el-dropdown-item>
                    <el-dropdown-item @click.native="closeOthersTags">关闭其它</el-dropdown-item>
                    <el-dropdown-item @click.native="closeAllTags">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "Tags",
  data() {
    return {
      refresh: false,
      active: "",
      contentmenuX: "",
      contentmenuY: "",
      contextmenuFlag: false
    };
  },
  created() { },
  mounted() {
    this.setActive();
  },
  watch: {
    tag() {
      this.setActive();
    },
    contextmenuFlag() {
      window.addEventListener("mousedown", this.watchContextmenu);
    }
  },
  computed: {
    ...mapGetters(["tagWel", "tagList", "tag", "website", "setting"]),
    tagLen() {
      return this.tagList.length || 0;
    }
  },
  methods: {
    handleRefresh() {
      this.refresh = true;
      this.$store.commit("SET_IS_REFRESH", false);
      setTimeout(() => {
        this.$store.commit("SET_IS_REFRESH", true);
      }, 100);
      setTimeout(() => {
        this.refresh = false;
      }, 1000);
    },
    generateTitle(item) {
      return this.$router.$avueRouter.generateTitle(
        item.label,
        (item.meta || {}).i18n
      );
    },
    watchContextmenu(event) {
      if (!this.$el.contains(event.target) || event.button !== 0) {
        this.contextmenuFlag = false;
      }
      window.removeEventListener("mousedown", this.watchContextmenu);
    },
    handleContextmenu(event) {
      let target = event.target;
      // 解决 https://github.com/d2-projects/d2-admin/issues/54
      let flag = false;
      if (target.className.indexOf("el-tabs__item") > -1) flag = true;
      else if (target.parentNode.className.indexOf("el-tabs__item") > -1) {
        target = target.parentNode;
        flag = true;
      }
      if (flag) {
        event.preventDefault();
        event.stopPropagation();
        this.contentmenuX = event.clientX;
        this.contentmenuY = event.clientY;
        this.tagName = target.getAttribute("aria-controls").slice(5);
        this.contextmenuFlag = true;
      }
    },
    // 激活当前选项
    setActive() {
      if (this.tagList.length >= 2 && this.tagList[0].value === this.tagWel.value && this.tagList[1].value === this.tagWel.value) {
        this.tagList.splice(0, 1);
      }
      for (const tag of this.tagList) {
        if (tag.value === this.tag.value || (tag.value.lastIndexOf("?") !== -1 && tag.value.substring(0, tag.value.lastIndexOf("?")) === this.tag.value)) {
          this.active = tag.value;
          return;
        }
      }
      let path = this.tag.value;
      if (path.lastIndexOf("?") !== -1) {
        path = path.substring(0, path.lastIndexOf("?"));
      }
      this.active = path;
    },
    menuTag(value, action) {
      if (action === "remove") {
        let openTag; // 最终要打开的页面
        const { tag, key } = this.findTag(value);

        if (tag.value === this.tag.value) {
          openTag = this.tagList[key === 0 ? key : key - 1]; // 如果关闭本标签让前推一个
        } else {
          openTag = this.tag;
          this.openTag(tag);
        }
        this.$store.commit("DEL_TAG", tag);
        this.openTag(openTag);
      }
    },
    openTag(item) {
      let tag;
      if (item.name) {
        tag = this.findTag(item.name).tag;
      } else {
        tag = item;
      }
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: tag.label,
          src: tag.value
        }, tag.meta),
        // query: tag.query
      });
    },
    findTag(value) {
      let tag, key;
      this.tagList.map((item, index) => {
        if (item.value === value) {
          tag = item;
          key = index;
        }
      });
      return { tag: tag, key: key };
    },
    // 因需清除每个keep-alive页面的缓存，需一个一个的激活tag到前台做删除
    activeTag(tagList) {
      tagList.forEach(item => {
        this.openTag(item);
        this.$store.commit("DEL_TAG", item);
      });
    },
    closeOthersTags() {
      this.contextmenuFlag = false;
      const openTag = this.tag;
      const tagList = this.tagList.filter(item =>
        item.value !== this.tag.value && !this.website.isFirstPage && item.value !== this.tagWel.value
      );
      this.activeTag(tagList);
      this.openTag(openTag);
    },
    closeAllTags() {
      if (this.tagList.length === 1 && this.tagList[0].value === this.tagWel.value) {
        return;
      }
      if (this.tagList.length >= 2 && this.tagList[0].value === this.tagWel.value && this.tagList[1].value === this.tagWel.value) {
        this.tagList.splice(0, 1);
      }
      this.contextmenuFlag = false;
      this.activeTag(this.tagList);
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      });
    }
  }
};
</script>


