<template>
    <basic-container>
        <avue-crud
            ref="crud"
            :option="option"
            :data="data"
            v-model="menu"
            @row-save="rowSave"
            @row-update="rowUpdate"
            :page.sync="page"
            @size-change="sizeChange"
            @current-change="currentChange"
            @search-change="searchChange">
            <!--操作栏-->
            <template slot="menu" slot-scope="{ row, index, size, type }">
                <el-button
                    class="el-icon-edit"
                    v-if="row.roleCode!=='admin' && row.roleCode!=='OrdinaryUser'"
                    :type="type"
                    :size="size"
                    @click="$refs.crud.rowEdit(row,index)">编辑
                </el-button>
                <el-button
                    class="el-icon-delete"
                    v-if="row.roleCode!=='admin' && row.roleCode!=='OrdinaryUser' "
                    @click="rowDel(row)"
                    :size="size"
                    :type="type">删除
                </el-button>
                <el-button v-if="row.roleName!=='admin'" @click="showPermission(row)" :size="size" :type="type">分配权限
                </el-button>
                <el-button
                    v-if="!row.children && row.roleCode!=='OrdinaryUser'"
                    @click="showUser(row)"
                    :size="size"
                    :type="type">分配用户
                </el-button>
            </template>
        </avue-crud>

        <!--分配用户弹出表格-->
        <el-dialog top="5vh" width="75%" title="分配用户" append-to-body :visible.sync="userDialogVisible">
            <el-container>
                <el-aside width="300px">
                    <avue-tree :option="userTreeOption" :data="userTreeData" @node-click="userNodeClick">
                        <span class="el-tree-node__label" slot-scope="{ node, data }">
                            <span>
                                <i v-if="data.children" class="el-icon-s-home"/>
                                <i v-else class="el-icon-user-solid"/>
                                {{ (node || {}).label }}
                            </span>
                        </span>
                    </avue-tree>
                </el-aside>
                <el-main>
                    <avue-crud
                        :data="userData"
                        :option="optionToUser"
                        :table-loading="loading"
                        @row-del="userRowDel"/>
                </el-main>
            </el-container>
        </el-dialog>

        <!--分配权限弹出表格-->
        <el-dialog top="5vh" width="75%" title="分配权限" append-to-body :visible.sync="permissionDialogVisible">
            <el-container>
                <el-aside width="200px">
                    <avue-tree
                        :option="permissionTreeOption"
                        :data="permissionTreeData"
                        @node-click="permissionNodeClick"/>
                </el-aside>
                <el-main>
                    <avue-crud :data="permissionData" :option="optionToPermission" @row-del="permissionRowDel">
                        <template slot-scope="scope" slot="menuLeft">
                            <el-button
                                type="primary"
                                icon="el-icon-success"
                                size="small"
                                plain
                                @click.stop="savePermission">保存权限设置
                            </el-button>
                        </template>
                        <template slot="permission" slot-scope="scope">
                            <el-col :span="6">
                                <avue-checkbox
                                    v-if="scope.row.elements && !scope.row.children"
                                    v-model="scope.row.elements.checkbox"
                                    :dic="scope.row.elements.permission"/>
                            </el-col>
                        </template>
                    </avue-crud>

                </el-main>
            </el-container>
        </el-dialog>

    </basic-container>

</template>

<script>
import {
  addOrgUserListToRole,
  addRole,
  addRolePermission,
  addUserToRole,
  delRole,
  delRolePermission,
  delRoleUser,
  getMenuList,
  getOrgUserTree,
  getPermissionListToRole,
  getRoleList,
  getUserListToRole,
  updateRole,
  updateRolePermission
} from "@/api/systemApi";

export default {

  data() {
    return {
      loading: true,
      role: {},
      permission: [],
      queryData: {},
      page: {},
      userDialogVisible: false,
      permissionDialogVisible: false,
      menuId: null,
      menu: {},
      data: [],
      option: {
        searchMenuSpan: 6,
        height: 520,
        dialogDrag: true,
        headerAlign: "center",
        align: "center",
        border: true,
        index: false,
        defaultExpandAll: true,
        addBtn: true,
        delBtn: false,
        editBtn: false,
        menuWidth: 300,
        column: [
          {
            label: "角色名称",
            prop: "roleName",
            search: true,
            align: "center",
            rules: [{
              required: true,
              message: "请填写角色名称",
              trigger: "blur"
            }]
          },
          {
            label: "角色编码",
            prop: "roleCode",
            align: "center"
          },
          {
            label: "描述",
            prop: "description",
            align: "center"
          }
        ],
      },
      userData: [],
      userTreeData: [],
      userTreeOption: {
        height: 500,
        defaultExpandAll: false,
        filterText: "搜索员工名过滤",
        addBtn: false,
        formOption: {
          labelWidth: 100
        }
      },
      optionToUser: {
        page: false,
        align: "left",
        height: 500,
        addBtn: false,
        editBtn: false,
        menuWidth: 120,
        menuAlign: "center",
        column: [
          {
            label: "用户名称",
            prop: "userName"
          },
          {
            label: "性别",
            prop: "gender",
            dicData: [
              {
                label: "男",
                value: 0
              }, {
                label: "女",
                value: 1
              }
            ]
          },
          {
            label: "手机号码",
            prop: "mobile"
          },
          {
            label: "组织区域",
            prop: "orgName"
          },

          {
            label: "岗位名称",
            prop: "postName"
          }
        ]
      },
      permissionTreeOption: {
        defaultExpandAll: false,
        height: 400,
        filterText: "搜索菜单名过滤",
        addBtn: false,
        formOption: {
          labelWidth: 100
        },
        props: {
          labelText: "标题",
          label: "menuName",
          value: "id",
          children: "children"
        }
      },
      permissionTreeData: [],
      permissionData: [],
      optionToPermission: {
        page: false,
        align: "left",
        addBtn: false,
        height: 600,
        editBtn: false,
        defaultExpandAll: true,
        menuAlign: "center",
        column: [
          {
            label: "菜单名称",
            prop: "menuName"
          },
          {
            label: "权限设置",
            prop: "permission",
            slot: true
          }
        ]
      }
    };
  },
  methods: {
    // ---------------------------一级表格(角色表格)-------------------------------
    // 点击搜索
    searchChange(params, done) {
      this.query(params, done);
    },
    // 添加角色
    rowSave(form, done, loading) {
      addRole(form).then(result => {
        if (result.success) {
          this.$message.success(result.message);
          this.query(this.queryData);
        } else {
          this.$message.error(result.message);
        }
        done();
      }).finally(() => {
        loading();
      });
    },
    // 删除角色
    rowDel(form) {
      this.$confirm("确认删除角色【" + form.roleName + "】").then(() => {
        delRole(form.id).then(result => {
          if (result.success) {
            this.$message.success(result.message);
            this.query(this.queryData);
          } else
            this.$message.error(result.message);

        });
      }).catch(() => {
      });
    },
    // 更新角色
    rowUpdate(form, index, done, loading) {
      updateRole(form).then(result => {
        if (result.success) {
          this.$message.success(result.message);
          this.query(this.queryData);
        } else {
          this.$message.error(result.message);
        }
        done();
      }).finally(() => {
        loading();
      });
    },
    // 更改每页个数
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.query(this.queryData);
    },
    // 更改当前页数
    currentChange(val) {
      this.page.currentPage = val;
      this.query(this.queryData);
    },
    // 查询角色
    query(params, done) {
      this.queryData = params;
      getRoleList(this.getQueryData(this.queryData)).then((result) => {
        this.data = result.data;
        // this.page=result.page
        this.page.total = result.page.total;
        if (done)
          done();
      });
    },
    // ---------------------------二级表格(分配用户表格,左树右表)-------------------------------
    // 点击分配用户,显示分配用户表格
    showUser(row) {
      this.role.id = row.id;
      this.role.roleName = row.roleName;
      this.queryRoleUserList();
      this.userDialogVisible = true;
    },
    // 获取分配用户里的角色用户列表
    queryRoleUserList() {
      this.loading = true;
      getUserListToRole(this.role.id).then(result => {
        this.userData = result.data;
        this.loading = false;
      });
    },
    // 点击分配用户左边的树用户(添加用户到角色)
    userNodeClick(data) {
      if (!data.children)
        this.$confirm("确认添加用户【" + data.label + "】到角色【" + this.role.roleName + "】?").then(() => {
          const red = { roleId: this.role.id, userId: data.value };
          addUserToRole(red).then(result => {
            if (result.success) {
              this.$message.success(result.message);
              // 刷新角色中的用户
              getUserListToRole(this.role.id).then(result => {
                this.userData = result.data;
              });
            } else
              this.$message.error(result.message);
          });
        });
      else {
        this.$confirm("确定添加【" + data.label + "】所有用户 到角色【" + this.role.roleName + "】?").then(() => {
          this.$confirm("此操作将会将这些用户都添加到此角色中去！是否确定?").then(() => {
            const red = { roleId: this.role.id, orgId: data.value };
            addOrgUserListToRole(red).then(result => {
              this.$message.success(result.message);
              getUserListToRole(this.role.id).then(result => {
                this.userData = result.data;
              });
            });
          });
        });
      }
    },
    // 删除指定角色中的用户
    userRowDel(form) {
      this.$confirm("确认从角色【" + this.role.roleName + "】中移除用户【" + form.userName + "】？").then(() => {
        delRoleUser({ userId: form.userId, roleId: this.role.id }).then(result => {
          if (result.success) {
            this.$message.success(result.message);
            // 刷新角色中的用户
            getUserListToRole(this.role.id).then(result => {
              this.userData = result.data;
            });
          } else
            this.$message.error(result.message);

        });
      }).catch(() => {
      });
    },
    // ---------------------------二级表格(分配权限)-------------------------------
    // 显示分配权限表格
    showPermission(row) {
      this.role.id = row.id;
      this.role.roleName = row.roleName;
      this.permissionQuery();
      this.permissionDialogVisible = true;
    },
    permissionNodeClick(data) {
      if (!data.children) {
        this.$confirm("确认将菜单【" + data.menuName + "】添加给角色【" + this.role.roleName + "】？").then(() => {
          addRolePermission({ roleId: this.role.id, menuId: data.id }).then(result => {
            if (result.success) {
              this.$message.success(result.message);
              // 刷新角色权限列表
              this.permissionQuery();
            } else
              this.$message.error(result.message);
          });
        });
      }

    },
    // 获取菜单权限列表
    permissionQuery() {
      getPermissionListToRole(this.role.id).then(result => {
        this.permissionData = result.data;
      });
    },
    // 保存权限设置
    savePermission() {
      // 获取已选择的权限列表,发给后端
      let select = [];
      for (const permission of this.permissionData) {
        if (permission.children) {
          for (const childrenPermission of permission.children) {
            if (childrenPermission.elements) {
              select = select.concat(childrenPermission.elements.checkbox);
            }
          }
        } else {
          if (permission.elements) {
            select = select.concat(permission.elements.checkbox);
          }
        }
      }
      updateRolePermission({ roleId: this.role.id, selectElementIds: select }).then(result => {
        this.$message.success(result.message);
        getPermissionListToRole(this.role.id).then(result => {
          this.permissionData = result.data;
        });
      });
    },
    // 删除指定角色菜单权限
    permissionRowDel(form) {
      let message = "确认从角色【" + this.role.roleName + "】中移除菜单【" + form.menuName + "】？";
      if (form.children) message = "确认移除父菜单【" + form.menuName + "】,其子菜单也将全部移除？";
      this.$confirm(message).then(() => {
        delRolePermission({ roleId: this.role.id, menuId: form.id }).then(result => {
          if (result.success) {
            this.$message.success(result.message);
            // 刷新角色权限列表
            this.permissionQuery();
          } else
            this.$message.error(result.message);
        });

      }).catch(() => {
      });
    },
    // ---------------------------其他方法-------------------------------
    getQueryData(params = {}) {
      return this.mergeJsonObject({ pageSize: this.page.pageSize, currentPage: this.page.currentPage }, params);
    },
    mergeJsonObject(jsonbject1, jsonbject2) {
      const resultJsonObject = {};
      for (const attr in jsonbject1) {
        resultJsonObject[attr] = jsonbject1[attr];
      }
      for (const attr2 in jsonbject2) {
        resultJsonObject[attr2] = jsonbject2[attr2];
      }
      return resultJsonObject;
    },
    hasPermission(code) {
      for (const item of this.$route.meta.permission) {
        if (code === item.code) {
          return true;
        }
      }
      return false;
    }
  },
  created() {
    // 查询角色表数据
    this.query();
    // 绑定分配用户左边树数据
    getOrgUserTree().then(result => {
      this.userTreeData = result.data;
    });
    // 绑定分配权限左边树数据
    getMenuList().then(result => {
      this.permissionTreeData = result.data;
    });
  },
  mounted() {
    this.$utils.resetHeight(0, this.option);
  }
};

</script>

<style scoped>
.el-aside {
    overflow: hidden;
}

/deep/ .el-tree {
    height: 500px;
    overflow: scroll;
}
</style>


<style>

</style>
