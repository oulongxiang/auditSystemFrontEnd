<template>
    <div class="user-setting">
        <basic-container>
            <el-tabs
                tab-position="left"
                stretch
                style="height: 400px;">
                <el-tab-pane label="安全设置">
                    <div class="user-setting__main">
                        <div class="user-setting__title">安全设置</div>
                        <div class="user-setting__item">
                            <div class="user-setting__meta">
                                <p class="title">
                                    <i class="el-icon-user"/>
                                    账号安全
                                </p>
                                <p class="subtitle">更改当前账号密码</p>
                            </div>
                            <div class="user-setting__menu">
                                <el-button @click="clickUpPassword">修改</el-button>
                            </div>
                        </div>
                        <div class="user-setting__item">
                            <div class="user-setting__meta">
                                <p class="title">
                                    <i class="el-icon-mobile-phone"/>
                                    绑定手机
                                </p>
                                <p class="subtitle">设置您的绑定手机号码</p>
                            </div>
                            <div class="user-setting__menu">
                                <el-button disabled size="small">修改</el-button>
                            </div>
                        </div>
                        <div class="user-setting__item">
                            <div class="user-setting__meta">
                                <p class="title">
                                    <i class="el-icon-message"/>
                                    绑定邮箱
                                </p>
                                <p class="subtitle">设置您的绑定邮箱</p>
                            </div>
                            <div class="user-setting__menu">
                                <el-button disabled size="small">修改</el-button>
                            </div>
                        </div>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="通知设置">
                    <div class="user-setting__main">
                        <div class="user-setting__title">通知设置</div>
                        <div class="user-setting__item">
                            <div class="user-setting__meta">
                                <p class="title">
                                    <i class="el-icon-document"/>
                                    系统消息
                                </p>
                                <p class="subtitle">系统性的通知或者更新消息</p>
                            </div>
                            <div class="user-setting__menu">
                                <el-switch v-model="value"/>
                            </div>
                        </div>
                        <div class="user-setting__item">
                            <div class="user-setting__meta">
                                <p class="title">
                                    <i class="el-icon-user"/>
                                    帐号消息
                                </p>
                                <p class="subtitle">帐号变更的通知消息</p>
                            </div>
                            <div class="user-setting__menu">
                                <el-switch v-model="value2"/>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <!--弹出专员选择表格-->
            <el-dialog width="500px" title="更改密码" append-to-body :visible.sync="passwordVisible">
                <el-form ref="doctorForm" label-width="100px">
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="原密码：">
                                <avue-input
                                    type="password"
                                    :minlength=6
                                    :maxlength=10
                                    v-model="form.password"
                                    placeholder="请输入您的原密码"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="新密码：">
                                <avue-input
                                    type="password"
                                    :minlength=6
                                    :maxlength=10
                                    v-model="form.newPassword"
                                    placeholder="请输入您的新密码"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="updatePassword" type="primary">提交</el-button>
                    <el-button @click="passwordVisible=false" type="info">取消</el-button>
                </span>

            </el-dialog>
        </basic-container>
    </div>
</template>

<script>
import { encryption } from "@/util/util";

export default {
  data() {
    return {
      form: { password: "", newPassword: "" },
      value: true,
      value2: true,
      passwordVisible: false
    };

  },
  methods: {
    updatePassword() {
      if (this.form.password.length < 6 || this.form.newPassword.length < 6) {
        this.$message.error("密码最小长度为6位");
        return;
      }
      const password = encryption({
        data: this.form,
        type: "MD5",
        key: "",
        param: ["password", "newPassword"]
      });
      updatePassword(password).then(result => {
        this.$message.success(result.message);
        this.passwordVisible = false;
      });
    },
    clickUpPassword() {
      this.passwordVisible = true;
      this.form.password = "";
      this.form.newPassword = "";
    }

  }
};
</script>

<style lang="scss">
.user-setting {
  &__main {
    padding: 8px 40px;
  }

  &__item {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }

  &__title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 12px;
  }

  &__meta {
    flex: 1;

    .title {
      margin: 6px 0;
      font-weight: 700;
      font-size: 14px;
    }

    .subtitle {
      margin: 8px 0;
      font-size: 14px;
      color: #555;
    }
  }
}
</style>
