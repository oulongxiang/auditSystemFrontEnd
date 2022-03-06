<template>
    <basic-container>
        <avue-crud
            ref="crud"
            :option="option"
            :data="data"
            v-model="bindData"
            :search.sync="keyword"
            @search-reset="searchReset"
            @search-change="searchChange"
            @current-change="currentChange"
            :before-open="beforeOpen"
            @size-change="sizeChange"
            @row-del="rowDel"
            @row-update="handleUpdate"
            @row-save="handleSave"
            @refresh-change="refreshChange"
            @sort-change="sortChange"
            :page.sync="page"
            :table-loading="loading">
            <!-- 自定义角色插槽-->
            <template slot="roleNames" slot-scope="scope">
                <el-tag>{{ !loading ? scope.row.roleNames.join(" | ") : "" }}</el-tag>
            </template>
            <template slot-scope="scope" slot="leaderEmpIdForm">
                <el-cascader
                    v-model="scope.row.leaderEmpId"
                    clearable
                    :props="{ filterable:true}"
                    :show-all-levels="false"
                    :options="userTreeData"
                    filterable
                    @change="userNodeClick"/>
            </template>

            <template slot-scope="scope" slot="emailForm">
                <el-input type="tel" v-model="scope.row.email"/>
            </template>


            <template slot-scope="scope" slot="postNameForm">
                <el-input
                    :disabled="scope.row.postName != null "
                    v-if="scope.row.postName != null && !keyword.postId"
                    style="width: 176px"
                    v-model="scope.row.postName"/>
                <el-input
                    :disabled="keyword.postId !=null"
                    v-if="keyword.postId !=null"
                    style="width: 176px"
                    v-model="keyword.postName"/>
                <el-button icon="el-icon-edit" @click.stop="postSubmit()">选择岗位</el-button>
            </template>

            <template slot-scope="scope" slot="orgNameForm">
                <el-cascader
                    v-model="scope.row.orgId"
                    clearable
                    :props="{ checkStrictly: true ,filterable:true}"
                    :options="orgTreeData"
                    filterable
                    @change="orgNodeClick"/>
            </template>

            <!-- 角色搜索自定义卡槽 -->
            <template slot-scope="scope" slot="roleNamesSearch">
                <el-select v-model="searchRoleList" multiple filterable @change="bindRoleList">
                    <el-option
                        v-for="item in roleList"
                        style="width: 300px"
                        :key="item.id"
                        :label="item.role_name"
                        :value="item.id"/>
                </el-select>
            </template>

            <template slot-scope="{disabled,size}" slot="orgNameSearch">
                <el-cascader
                    v-model="keyword.orgId"
                    clearable
                    :props="{ checkStrictly: true ,filterable:true}"
                    :options="orgTreeData"
                    filterable
                    @change="orgNodeClick"/>
            </template>

            <template slot-scope="{disabled,size}" slot="responsibleOrgNameSearch">
                <el-cascader
                    v-model="responsibleOrgIds"
                    clearable
                    filterable
                    :props="{ checkStrictly: true ,filterable:true,multiple:true}"
                    :options="orgTreeData"
                    collapse-tags/>
            </template>


            <template slot-scope="scope" slot="userNameLabel">
                <span><span style="color: #e54d42">*</span>用户姓名</span>
            </template>

            <template slot-scope="scope" slot="leaderEmpIdLabel">
                <span><span style="color: #e54d42"/>上级领导</span>
            </template>

            <template slot-scope="scope" slot="genderLabel">
                <span><span style="color: #e54d42">*</span>性别</span>
            </template>


            <template slot-scope="scope" slot="orgNameLabel">
                <span><span style="color: #e54d42">*</span>所属组织</span>
            </template>

            <template slot-scope="{row,index, size, type}" slot="menu">
                <el-button :type="type" icon="el-icon-edit" :size="size" @click.stop="$refs.crud.rowEdit(row,index)">
                    编辑
                </el-button>
                <el-button :type="type" icon="el-icon-delete" :size="size" @click.stop="$refs.crud.rowDel(row,index)">
                    删除
                </el-button>
                <el-button :type="type" icon="el-icon-date" @click="clickLoginLog(row)" :size="size">登录日志</el-button>
                <el-button @click="showRole(row)" icon="el-icon-edit" :size="size" :type="type">角色设置</el-button>
                <el-button @click="clickTerritory(row) " icon="el-icon-s-flag" :size="size" :type="type">负责区域
                </el-button>
            </template>

        </avue-crud>

        <!--登录日志弹出表格-->
        <el-dialog top="5vh" width="55%" title="登录日志" append-to-body :visible.sync="loginLogDialogVisible">
            <el-container>
                <user-login-log :userId="userId"/>
            </el-container>
        </el-dialog>

        <!--负责区域弹出表格-->
        <el-dialog
            @close="closeRole"
            top="5vh"
            width="950px"
            :title="'负责区域【'+userName+'】'"
            append-to-body
            :visible.sync="territoryDialogVisible">
            <el-container>
                <territory :userId="userId"/>
            </el-container>
        </el-dialog>


        <!--分配角色弹出表格-->
        <el-dialog
            @close="closeRole"
            top="5vh"
            width="55%"
            title="分配角色"
            append-to-body
            :visible.sync="roleDialogVisible">
            <el-container>
                <el-aside width="200px">
                    <avue-tree :option="roleTreeOption" :data="roleTreeData" @node-click="roleNodeClick"/>
                </el-aside>
                <el-main>
                    <avue-crud
                        :data="roleData"
                        :option="roleOption"
                        :table-loading="roleLoading"
                        @row-del="roleRowDel"/>
                </el-main>
            </el-container>
        </el-dialog>

        <!-- 选择岗位弹出窗 -->
        <el-dialog
            top="2vh"
            v-dialogdrag
            width="70%"
            title="选择岗位"
            height="30%"
            append-to-body
            :visible.sync="postDialogVisible"
            :beforeClose="closePost">
            <avue-crud
                :data="postData"
                :page.sync="postPage"
                :option="postOption"
                @search-change="postSearchChange"
                ::table-loading="postLoading"
                @size-change="postSizeChange"
                @current-change="postCurrentChange"
                @refresh-change="refreshData"
                @sort-change="sortChange"
                @row-del="rowDel">
                <template slot-scope="{ row, index, size, type }" slot="menu">
                    <el-button :type="type" icon="el-icon-edit" :size="size" @click.stop="postSelect(row,index)">选择此岗位
                    </el-button>
                </template>
            </avue-crud>
        </el-dialog>


    </basic-container>
</template>

<script>
import userLoginLog from "./user-login-log";

import {
  addUserInfoOut,
  bindRole,
  delUserInfoOut,
  getOrgList,
  getUserInfoEmpIdList,
  getUserInfoList
} from "@/api/userApi";

export default {
  data() {
    return {
      loading: false, // 是否开启表格数据加载中
      postDialogVisible: false, // 选择岗位弹出窗口状态
      postLoading: false, // 选择岗位加载状态
      postPage: {}, // 选择岗位窗口分页
      bindData: {},
      postData: [], // 选择岗位数据
      queryParams: {}, // 查询条件参数
      userInfoEmpIdList: [],
      roleList: [],
      searchRoleList: [],
      organizationList: [],
      keyword: {},
      page: {}, // 分页相关参数
      sort: {}, // 排序相关参数
      data: [], // 表格数据
      selectUser: {},
      orgTreeData: [],
      responsibleOrgIds: [],
      loginLogDialogVisible: false,
      territoryDialogVisible: false,
      orgTreeOption: {
        defaultExpandAll: false,
        filterText: "搜索组织名过滤",
        addBtn: false,
        formOption: {
          labelWidth: 100
        }
      },
      userTreeData: [],
      userTreeOption: {
        height: 500,
        defaultExpandAll: false,
        filterText: "搜索上级员工名过滤",
        addBtn: false,
        formOption: {
          labelWidth: 100
        }
      },
      option: { // 表格参数设置
        dialogDrag: true,
        searchMenuSpan: 4, // 设置搜索菜单和查询条件在同一行显示
        addBtn: true,
        editBtn: false,
        delBtn: false,
        menu: true,
        border: true,
        menuWidth: 360,
        column: [ // 表格列设置
          {
            label: "员工编号",
            prop: "empCode",
            sortable: "custom",
            orderProp: "a.emp_code",
            searchOrder: 1,
            width: 120,
            search: true,
          },
          {
            label: "姓名",
            prop: "userName",
            searchOrder: 2,
            width: 100,
            search: true,
          },
          {
            label: "上级领导",
            prop: "leaderEmpId",
            hide: true,
            labelslot: true,
            fromslot: true,
            addDisplay: true,
          },
          {
            label: "身份证号",
            prop: "idCard",
            hide: true,
            fromslot: true,
            addDisplay: true,
            rules: [{
              required: true,
              message: "请输入身份证号",
              trigger: "blur"
            }]
          },
          {
            label: "邮箱",
            prop: "email",
            hide: true,
            fromslot: true,
            addDisplay: true,
          },
          {
            label: "性别",
            prop: "gender",
            type: "select",
            searchOrder: 3,
            width: 100,
            search: true,
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: getDictList("gender")
          },
          {
            label: "手机号码",
            prop: "mobile",
            searchOrder: 4,
            sortable: "custom",
            orderProp: "a.mobile",
            search: true,
            width: 100,
            rules: [
              { required: true, message: "请输入手机号", trigger: "blur" },
              {
                pattern: /^1[3|4|5|7|8]\d{9}$/,
                message: "请输入正确的手机号码",
                trigger: "blur"
              }
            ],
          },
          {
            label: "所属组织",
            prop: "orgName",
            sortable: "custom",
            orderProp: "a.org_id",
            labelslot: true,
            width: 140,
            searchOrder: 5,
            type: "select",
            searchFilterable: true,
            search: true,
            searchslot: true,
            fromslot: true,
            props: {
              label: "text",
              value: "value"
            },
            dicData: [],
          },
          {
            label: "岗位名称",
            width: 140,
            prop: "postName",
            orderProp: "a.post_id",
            sortable: "custom",
            fromslot: true,
            props: {
              label: "text",
              value: "value"
            },
            dicData: [],
          },
          {
            label: "角色",
            prop: "roleNames",
            slot: true,
            search: true,
            searchOrder: 6,
            searchslot: true,
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: "负责区域",
            prop: "responsibleOrgName",
            search: true,
            searchslot: true,
            searchSpan: 8,
            overHidden: true,
            addDisplay: false,
            editDisplay: false,
          }
        ]
      },
      postOption: {
        page: true,
        searchBtn: true,
        index: true,
        indexLabel: "序号",
        emptyBtn: false,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        align: "center",
        menuWidth: 100,
        height: 700,
        menu: true,
        menuAlign: "center",
        searchMenuSpan: 6,
        column: [
          {
            label: "岗位名称", prop: "postName", search: true
          },
          {
            label: "数据来源", // 列头名
            prop: "origin", // 对应的列字段名
            align: "left", // 左对齐
            type: "select",
            searchSpan: 5,
            search: true, // 开启参数搜索
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: getDictList("origin")
          }
        ]
      },
      roleDialogVisible: false,
      roleLoading: false,
      roleTreeOption: {
        defaultExpandAll: false,
        filterText: "搜索角色名过滤",
        addBtn: false,
        props: {
          label: "roleName",
          value: "roleId",
          id: "roleId",
        },
        formOption: {
          labelWidth: 100
        }
      },
      userId: undefined,
      userName: undefined,
      roleTreeData: [],
      roleData: [],
      roleOption: {
        page: false,
        align: "left",
        height: 500,
        addBtn: false,
        editBtn: false,
        menuWidth: 120,
        menuAlign: "center",
        column: [
          {
            label: "角色名称",
            prop: "roleName",
            align: "center",
          }
        ]
      }

    };
  },
  created() {
    this.bindOrgDic();
    this.bindRole();
    getOrgUserEmpIdTree().then(result => {
      this.userTreeData = result.data;
    });
    getOrganizationTree().then(result => {
      this.orgTreeData = result.data;
    });
    this.query();
    getAllRoleList().then(result => {
      this.roleTreeData = result.data;
    });
  },
  methods: {

    // --------------------选择岗位窗口方法--------------------------------------
    closePost() {
      this.postDialogVisible = false;
    },
    refreshData() {
      this.postQuery(this.queryData);
    },
    postSelect(row) {
      this.$confirm("确认选择此岗位？", "提示").then(() => {
        this.keyword.postId = row.postId;
        this.keyword.postName = row.postName;
        this.postDialogVisible = false;
      });
    },
    postSearchChange(params, done) {
      this.postPage.currentPage = 1;
      this.postQuery(params, done);
    },
    postSizeChange(val) {
      this.postPage.currentPage = 1;
      this.postPage.pageSize = val;
      this.postQuery(this.queryData);
    },
    postCurrentChange(val) {
      this.postPage.currentPage = val;
      this.postQuery(this.queryData);
    },
    postSubmit() {
      this.postDialogVisible = true;
      this.postQuery();
    },
    postQuery(params, done) {
      this.postLoading = true;
      this.queryData = params;
      const param = this.$utils.getQueryParam(this.queryData, this.postPage, this.sort);
      getPositionList(param).then((result) => {
        this.postPage = result.page;
        this.postData = result.data;
        this.$utils.resetHeight(0, this.postOption);
        if (done)
          done();
        this.postLoading = false;

      });
    },
    // ----------------------------------------------------------
    beforeOpen(done, type) {
      if (["edit"].includes(type)) {

        delete this.keyword.postId;

      } else if (["add"].includes(type)) {
        delete this.keyword.postId;
        delete this.keyword.orgId;
        delete this.keyword.leaderEmpId;
        Object.keys(this.bindData).forEach(key => this.bindData[key] = null);
      }
      done();
    },

    userNodeClick(data) {
      this.keyword.leaderEmpId = data[data.length - 1];
    },
    orgNodeClick(data) {
      this.keyword.orgId = data[data.length - 1];
    },
    responsibleOrgNodeClick(data) {
      this.keyword.responsibleOrgIds = data[data.length - 1];
    },
    handleSave(form, done, loading) {
      if (this.keyword.leaderEmpId) {
        form.leaderEmpId = this.keyword.leaderEmpId;
      }
      if (this.keyword.orgId) {
        form.orgId = this.keyword.orgId;
      } else {
        this.$message.error("组织机构不能为空白");
        loading();
        return;
      }
      if (!form.mobile) {
        this.$message.error("手机号码不能为空");
        loading();
        return;
      }
      if (!form.gender) {
        this.$message.error("性别不能为空");
        loading();
        return;
      }
      if (this.keyword.postId) {
        form.postId = this.keyword.postId;
        delete this.keyword.postId;
      }
      addUserInfoOut(form).then(() => {
        this.loading = false;
        // 取消禁用搜索菜单
        done();
        this.$message.success("操作成功");
        this.query(this.queryParams);
      }).finally(() => {
        loading();
      });
    },

    handleUpdate(form, index, done, loading) {
      if (form && form.leaderEmpId && form.leaderEmpId.length === 0) {
        delete form.leaderEmpId;
      }
      if (this.keyword.leaderEmpId) {
        form.leaderEmpId = this.keyword.leaderEmpId;
      }
      if (this.keyword.orgId) {
        form.orgId = this.keyword.orgId;
      } else {
        if (form.orgId.length === 0) {
          this.$message.error("组织机构不能为空白");
          loading();
          return;
        }
      }
      if (!form.mobile) {
        this.$message.error("手机号码不能为空");
        loading();
        return;
      }
      if (form.gender) {
        if (form.gender === "男") {
          form.gender = 760;
        } else if (form.gender === "女") {
          form.gender = 761;
        }
      } else {
        this.$message.error("性别不能为空白");
        loading();
        return;
      }
      if (this.keyword.postId) {
        form.postId = this.keyword.postId;
        delete this.keyword.postId;
      }
      addUserInfoOut(form).then(() => {
        this.query(this.queryParams);
        // 取消禁用搜索菜单
        this.loading = false;
        done();
        this.$message.success("操作成功");
      }).finally(() => {
        loading();
      });
    },
    // 删除外部员工
    rowDel(row) {
      this.$confirm("确认删除此外部人员?").then(() => {
        this.loading = true;
        delUserInfoOut(row.userId).then(() => {
          this.query(this.queryParams);
          this.loading = false;
          this.$message.success("删除成功");
        });
      });
    },
    // 获取所有有empid的员工列表
    getUserInfoEmpIdList() {
      getUserInfoEmpIdList().then(result => {
        this.userInfoEmpIdList = result.data;
      });
    },
    /**
     * 点击搜索后触发
     * @param params 搜索的参数
     * @param done   控制搜索转圈
     */
    searchChange(params, done) {
      // 点击查询后需要将当前页数设置为1
      this.page.currentPage = 1;
      // 调用查询方法
      this.query(params, done);
    },
    /** 点击刷新后触发
     */
    refreshChange() {
      // 调用查询方法
      this.query();
    },
    /**
     * 点击某个字段排序后触发 设置前端排序与后端排序一致
     * @param val 排序的字段等信息
     */
    sortChange(val) {
      // 封装成后端可用的排序参数
      this.sort = this.$utils.getSortParam(val, this.option);
      this.query();
    },
    /** 页数变更后触发
     * @param val 变更的页数
     */
    currentChange(val) {
      // 设置当前页数
      this.page.currentPage = val;
      // 重新执行查询
      this.query(this.queryParams);
    },
    /** 每页数据个数变更后触发
     * @param val 变更的每页数据个数
     */
    sizeChange(val) {
      // 设置当前页数为1
      this.page.currentPage = 1;
      // 设置每页个数
      this.page.pageSize = val;
      // 重新执行查询
      this.query(this.queryParams);
    },
    /**
     * 查询数据
     * @param params 查询条件 (可穿)
     * @param done   控制搜索转圈（可选）
     */
    query(params, done) {
      // 显示数据加载中
      this.loading = true;
      if (params && this.keyword.orgId) {
        params.orgName = this.keyword.orgId;
      }
      if (params && this.responsibleOrgIds.length !== 0) {
        params.territory = this.responsibleOrgIds.join(",");
      }
      // 设置查询条件
      this.queryParams = params;
      // 拼接查询条件+分页参数+排序参数
      const queryData = this.$utils.getQueryParam(this.queryParams, this.page, this.sort);
      // 发起请求获取数据并设置分页
      getUserInfoList(queryData).then(result => {
        // 请求成功,设置表格数据
        this.data = result.data;
        // 设置分页信息
        this.page = result.page;
        // 一般只有点击搜索时会传入改参数,用于禁用搜索菜单
        if (done) {
          // 取消禁用搜索菜单
          done();
        }
        // 取消转圈
        this.loading = false;
      });
    },
    searchReset() {
      this.responsibleOrgIds = [];
    },
    // 组织选择框绑定
    bindOrgDic() {
      getOrgList().then((result) => {
        this.option.column[7].dicData = result.data;
        this.organizationList = result.data;
      });
    },
    bindRoleList() {
      if (this.searchRoleList) {
        this.keyword.roleNames = this.searchRoleList.join();
      }
    },
    bindRole() {
      bindRole().then((result) => {
        this.roleList = result.data;
      });
    },
    showRole(row) {
      this.selectUser.userId = row.id;
      this.selectUser.userName = row.userName;
      this.selectUser.idCard = row.idCard;
      this.getRoleListToUser();
      this.roleDialogVisible = true;
    },
    clickTerritory(row) {
      this.userName = row.userName;
      this.userId = row.userId;
      this.territoryDialogVisible = true;
    },
    closeRole() {
      this.query();
    },
    getRoleListToUser() {
      this.roleLoading = true;
      getRoleListToUser(this.selectUser.userId).then(result => {
        this.roleData = result.data;
        this.roleLoading = false;
      });
    },
    roleNodeClick(data) {
      this.$confirm("确认给用户【" + this.selectUser.userName + "】添加角色【" + data.roleName + "】？").then(() => {
        addUserToRole({ roleId: data.roleId, userId: this.selectUser.userId }).then(result => {
          this.$message.success(result.message);
          // 刷新角色中的用户
          this.getRoleListToUser();
        });
      });
    },
    roleRowDel(form) {
      this.$confirm("确认从用户【" + this.selectUser.userName + "】中移除角色【" + form.roleName + "】？").then(() => {
        delRoleUser({ userId: this.selectUser.userId, roleId: form.roleId }).then(result => {
          this.$message.success(result.message);
          this.getRoleListToUser();
        });
      });
    },
    clickLoginLog(row) {
      this.userId = row.userId;
      this.loginLogDialogVisible = true;
    }
  },
  mounted() {
    this.$utils.resetHeight(0, this.option);
  },
  components: { userLoginLog, territory }
};
</script>

<style scoped>

</style>
