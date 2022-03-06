<template>
    <div class="user-info">
        <el-row :span="24">
            <el-col :span="8">
                <basic-container>
                    <div class="user-info__content">
                        <img
                            class="user-info__img"
                            :src="'http://oamobile.tul.cn:8000/serverj/readUserIcon?user='+userInfo.ssoCode +'&size=120'"
                            alt="">
                        <p class="user-info__name">{{ userInfo.userName }}</p>
                        <router-link
                            class="user-info__setting"
                            :to="{path:'/info/setting'}">个人设置
                        </router-link>
                        <p class="user-info__desc">{{ form.ms }}</p>
                        <div class="user-info__detail-desc">
                            <p><i class="el-icon-message"/><span>{{ userInfo.email }}</span></p>
                            <p><i class="el-icon-postcard"/><span>{{ userInfo.orgName }} · {{
                                userInfo.postName
                            }}</span></p>
                            <p><i class="el-icon-tickets"/><span>{{ userInfo.ssoCode }}</span></p>
                        </div>
                        <div class="user-info__divider"/>
                    </div>
                </basic-container>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import option from "@/const/user/info";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      type: "info",
      option: option,
      tags: [],
      form: {
        ms: "保护头发，人人有责"
      }
    };
  },
  created() {

  },
  computed: {
    ...mapGetters([
      "userInfo"
    ])
  },
  methods: {
    handleSubmit() {
      this.$message({
        message: this.form,
        type: "success"
      });
    },
    handleChange(item) {
      this.type = item.prop;
    }
  }
};
</script>

<style lang="scss">
.user-info {
  .avue-tabs {
    padding: 0 10px;
  }

  .el-tabs__content {
    padding: 20px 0;
  }

  &__img {
    display: block;
    margin: 0 auto;
    border-radius: 100%;
    width: 100px;
    height: 100px;
  }

  &__name {
    text-align: center;
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 0;
    margin-top: 10px;
  }

  &__setting {
    margin-bottom: 12px;
    display: block;
    font-size: 12px;
    color: #409eff;
    text-align: center;
  }

  &__desc {
    text-align: center;
    width: 200px;
    margin: 0 auto;
  }

  &__detail-desc {
    margin-top: 50px;
    font-size: 14px;

    p {
      margin-bottom: 10px;
    }

    span {
      margin-left: 10px;
    }
  }

  &__divider {
    border-top: 1px dashed #e8e8e8;
    display: block;
    height: 0;
    width: 100%;
    margin: 24px 0;
    clear: both;
  }

  &__tags {
    .el-tag {
      margin: 0 5px 5px 0;
    }
  }
}
</style>
