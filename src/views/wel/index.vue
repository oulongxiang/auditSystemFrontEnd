<template>
    <div>
        <div class="wel__header">
            <div class="wel__info">
                <img
                    :src="'http://oamobile.tul.cn:8000/serverj/readUserIcon?user='+userInfo.ssoCode +'&size=120'"
                    alt=""
                    class="wel__info-img">
                <div class="wel__info-content">

                    <div
                        v-if="userInfo.postName"
                        class="wel__info-title"
                        v-html="getWelcome(userInfo.userName + ' ' + userInfo.postName)"/>
                    <div v-else class="wel__info-title" v-html="getWelcome(userInfo.userName)"/>
                    <div v-if="userInfo.loginTime">上次登录时间：{{ userInfo.loginTime }}</div>
                </div>
            </div>
            <div class="wel__extra">
                <div class="wel__extra-item">
                    <p class="wel__extra-title">
                        项目数
                    </p>
                    <p class="wel__extra-subtitle">
                        56
                    </p>
                </div>
                <div class="wel__extra-item">
                    <p class="wel__extra-title">
                        排名
                    </p>
                    <p class="wel__extra-subtitle">
                        8 <span>/ 24</span>
                    </p>
                </div>
                <div class="wel__extra-item">
                    <p class="wel__extra-title">
                        项目访问
                    </p>
                    <p class="wel__extra-subtitle">
                        2,223
                    </p>
                </div>
            </div>
        </div>
        <basic-container>
            <avue-data-box :option="option1"/>
        </basic-container>

        <el-row :span="24">
            <el-col :span="18">
                <basic-container>
                    <avue-data-progress
                        :option="option3"
                        style="margin-bottom:35px"/>
                    <avue-data-tabs :option="option"/>
                </basic-container>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Wel",
  data() {
    return {
      notHandleList: [],
      inHandleList: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tagWel"]),
    option1() {
      return {
        span: 6,
        data: [
          {
            title: "错误日志",
            count: 12332,
            icon: "el-icon-warning",
            color: "rgb(49, 180, 141)",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            title: "数据展示",
            count: 33,
            icon: "el-icon-view",
            color: "rgb(56, 161, 242)",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            title: "权限管理",
            count: 2223,
            icon: "el-icon-setting",
            color: "rgb(117, 56, 199)",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            title: "用户管理",
            count: 2223,
            icon: "el-icon-setting",
            color: "rgb(230, 71, 88)",
            href: "https://avuejs.com",
            target: "_blank"
          }
        ]
      };
    },
    option3() {
      return {
        span: 8,
        data: [
          {
            title: "转化率",
            color: "rgb(178, 159, 255)",
            count: 32,
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            title: "签到率",
            color: "rgb(230, 71, 88)",
            count: 32,
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            title: "签到率",
            color: "rgb(230, 71, 88)",
            count: 32,
            href: "https://avuejs.com",
            target: "_blank"
          }
        ]
      };
    },
    option2() {
      return {
        span: 12,
        data: [
          {
            title: "今日注册",
            count: 12678,
            icon: "el-icon-tickets",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            title: "今日注册",
            count: 22139,
            icon: "el-icon-success",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            title: "今日注册",
            count: 35623,
            icon: "el-icon-info",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            title: "今日注册",
            count: 16826,
            icon: "el-icon-message",
            href: "https://avuejs.com",
            target: "_blank"
          }
        ]
      };
    },
    option() {
      return {
        span: 8,
        data: [
          {
            title: "分类统计",
            subtitle: "实时",
            count: 7993,
            allcount: 10222,
            text: "当前分类总记录数",
            color: "rgb(27, 201, 142)",
            key: "分"
          },
          {
            title: "附件统计",
            subtitle: "实时",
            count: 3112,
            allcount: 10222,
            text: "当前上传的附件数",
            color: "rgb(230, 71, 88)",
            key: "附"
          },
          {
            title: "文章统计",
            subtitle: "实时",
            count: 908,
            allcount: 10222,
            text: "评论次数",
            color: "rgb(56, 161, 242)",
            key: "评"
          }
        ]
      };
    },
    option4() {
      return {
        index: true,
        column: [
          {
            label: "工作任务",
            prop: "rw"
          },
          {
            width: 500,
            label: "工作任务",
            prop: "nr",
            overHidden: true
          },
          {
            label: "工作任务",
            prop: "sj"
          }
        ]
      };
    }
  },
  updated() {

  },
  mounted() {
    if (this.$utils.isMobile()) {
      this.$router.push({ path: "/phonePageIndex" });
    } else {
      this.$router.push({ path: this.tagWel.value });
    }
  },
  methods: {

    /**
         * @description: 跳转路由到风险信息模块
         * @param {*} data
         * @return {*}
         */
    goto(path) {
      this.$router.push({ path: "/riskStrategy/riskInfo", query: { riskCode: path }});
    },
    getWelcome(name) {
      return this.$utils.welcomeWords(name);
    },
  }
};
</script>

<style scoped="scoped" lang="scss">
.risklink {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    position: relative;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 20px;
    font-weight: 500;
    color: #409EFF;
}

.riskListLink {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    position: relative;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 15px;
    font-weight: 500;
    color: #ff4040;
}

.wel {
    &__header {
        padding: 25px 40px;
        border-bottom: 1px solid #e8e8e8;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__info {
        display: flex;
        align-items: center;

        &-img {
            border-radius: 72px;
            display: block;
            width: 72px;
            height: 72px;

            img {
                width: 100%;
                height: 100%;
                display: block;
            }
        }

        &-content {
            position: relative;
            margin-left: 24px;
            color: rgba(0, 0, 0, 0.45);
            line-height: 22px;
        }

        &-title {
            font-size: 20px;
            line-height: 28px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            margin-bottom: 12px;
        }

        &-subtitle {
            position: relative;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
            line-height: 22px;
        }
    }

    &__extra {
        &-item {
            position: relative;
            padding: 0 32px;
            display: inline-block;

            &:last-child {
                &::after {
                    display: none;
                }
            }

            &:after {
                background-color: #e8e8e8;
                position: absolute;
                top: 30px;
                right: 0;
                width: 1px;
                height: 40px;
                content: "";
            }
        }

        &-title {
            color: rgba(0, 0, 0, 0.45);
            font-size: 14px;
            line-height: 22px;
            margin-bottom: 4px;
        }

        &-subtitle {
            color: rgba(0, 0, 0, 0.85);
            font-size: 30px;
            line-height: 38px;
            margin: 0;

            span {
                color: rgba(0, 0, 0, 0.45);
                font-size: 20px;
            }
        }
    }
}

.cardstyle {
    height: 175px;
}

/deep/ .el-tabs__content {
    overflow: scroll;
    position: relative;
}

/deep/ .el-tabs__item:hover {
    color: #409EFF;
    background-color: #409EFF;
}

/deep/ .el-tabs__item.is-active {
    color: #409EFF;
    background-color: #409EFF;
}

/deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #fff;
    background-color: #409EFF;
    border-right-color: #DCDFE6;
    border-left-color: #DCDFE6;
}

/deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item:hover {
    color: #fff;
    background-color: #409EFF;
    border-right-color: #DCDFE6;
    border-left-color: #DCDFE6;
}


.showriskclass {
    background: rgb(255, 255, 255);
    height: 352px;
    border: #fff;
}
</style>
