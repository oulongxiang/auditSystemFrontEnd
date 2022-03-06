<template>
    <basic-container>
        <avue-crud
            :option="option"
            :data="data"
            v-model="menuData"
            @row-save="rowSave"
            @row-update="rowUpdate"
            :before-open="beforeOpen"
            @row-del="rowDel">
            <!--图标-->
            <template slot-scope="scope" slot="iconForm">
                <avue-input-icon v-model="menuData.icon" placeholder="请选择图标" :icon-list="iconList"/>
            </template>
            <template slot="icon" slot-scope="scope">
                <i :class="scope.row.icon" style="font-size:24px"/>
                <!--自定义选择框-->
            </template>
            <template slot-scope="scope" slot="menuParentIdForm">
                <avue-select
                    v-model="menuData.menuParentId"
                    :disabled="menuData.menuParentId===null"
                    :placeholder="menuData.menuParentId===null?'一级菜单无法设置父菜单':'请选择父菜单'"
                    type="tree"
                    :dic="dic"/>
            </template>
            <!--操作栏-->
            <template slot="menu" slot-scope="{ row, index, size, type }">
                <el-button v-if="!row.children" @click="showElement(row)" :size="size" :type="type">页面元素</el-button>
            </template>
        </avue-crud>

        <el-dialog width="1100px" v-dialogdrag append-to-body :visible.sync="menuDialogVisible">
            <avue-crud
                :data="elementData"
                :option="optionToElement"
                @row-save="elementRowSave"
                @row-update="elementRowUpdate"
                @row-del="elementRowDel"/>
        </el-dialog>

    </basic-container>

</template>

<script>
import {
  addMenu,
  addMenuElement,
  delMenu,
  delMenuElement,
  getMenuList,
  queryElement,
  updateMenu,
  updateMenuElement
} from "@/api/systemApi";
import { bindIconSelect } from "@/api/iconApi";

export default {
  data() {
    return {
      menuDialogVisible: false,
      menuId: null,
      dic: [],
      iconList: [],
      menuData: {},
      data: [],
      form: "el-icon-info",
      option: {
        headerAlign: "center",
        align: "center",
        border: true,
        index: false,
        defaultExpandAll: true,
        dialogDrag: true,
        addBtn: true,
        column: [
          {
            label: "菜单名称",
            prop: "menuName",
            minWidth: 200,
            align: "left",
            rules: [{
              required: true,
              message: "请填写菜单名称",
              trigger: "blur"
            }]
          },
          {
            label: "父菜单",
            prop: "menuParentId",
            align: "left",
            hide: true,
            type: "select",
            formslot: true,
            labelslot: false
          },
          {
            label: "菜单路径",
            prop: "menuUrl",
            align: "left",
            minWidth: 200,
          },
          {
            label: "显示路径",
            prop: "menuPath",
            align: "left",
            minWidth: 200,
            rules: [{
              required: true,
              message: "请填写显示路径",
              trigger: "blur"
            }]
          },
          {
            label: "菜单图标",
            prop: "icon",
            type: "icon",
            slot: true,
            formslot: true
          },
          {
            label: "描述",
            prop: "description",
            align: "left",
            minWidth: 180,
          },
          {
            label: "排序",
            prop: "sort",
            align: "center",
            minWidth: 60,
            type: "number"
          }
        ],
      },

      elementData: [],
      optionToElement: {
        dialogDrag: true,
        height: 400,
        page: false,
        align: "left",
        menuAlign: "center",
        column: [
          {
            label: "元素名称",
            prop: "elementName",
            rules: [{
              required: true,
              message: "请填写元素名称",
              trigger: "blur"
            }]
          },
          {
            label: "元素编码",
            prop: "elementCode",
            rules: [{
              required: true,
              message: "请填写元素编码",
              trigger: "blur"
            }]
          },
          {
            label: "元素图标",
            prop: "elementIcon"
          },
          {
            label: "URI",
            prop: "apiUri"
          },
          {
            label: "描述",
            prop: "description"
          }
        ]
      }
    };
  },
  methods: {
    // 点击元素添加后
    elementRowSave(form, done, loading) {
      form.menuId = this.menuId;
      addMenuElement(this.$jsonUtil.clearBlankDate(form)).then(result => {
        this.$message.success(result.message);
        queryElement(this.menuId).then(result => {
          this.elementData = result.data;
          done();
        });
      }).finally(() => {
        loading();

      });
    },
    // 获取指定菜单元素列表
    showElement(row) {
      this.menuId = row.id;
      queryElement(row.id).then(result => {
        this.elementData = result.data;
        this.menuDialogVisible = true;
      });
    },
    // 编辑更新指定元素
    elementRowUpdate(form, index, done, loading) {
      updateMenuElement(this.$jsonUtil.clearBlankDate(form)).then(result => {
        this.$message.success(result.message);
        queryElement(this.menuId).then(result => {
          this.elementData = result.data;
          done();
        });
      }).finally(() => {
        loading();
      });
    },
    // 删除指定控件元素
    elementRowDel(form) {
      this.$confirm("确认删除元素【" + form.elementName + "】").then(() => {
        delMenuElement(form.id).then(result => {
          if (result.success) {
            this.$message.success(result.message);
            queryElement(this.menuId).then(result => {
              this.elementData = result.data;
            });
          } else
            this.$message.error(result.message);

        });
      }).catch(() => {
      });
    },
    rowSave(form, done, loading) {
      form.id = null;
      form.menuType = "移动端";
      addMenu(this.$jsonUtil.clearBlankDate(form)).then(result => {
        this.$message.success(result.message);
        this.query();
        done();
      }).finally(() => {
        this.$utils.setEmpty(this.menuData);
        loading();
      });
    },
    rowUpdate(form, index, done, loading) {
      updateMenu(this.$jsonUtil.clearBlankDate(form)).then(result => {
        this.$message.success(result.message);
        this.query();
        done();
      }).finally(() => {
        this.$utils.setEmpty(this.menuData);
        loading();
      });
    },
    rowDel(form) {
      this.$confirm("确认删除菜单【" + form.menuName + "】").then(() => {
        delMenu(form.id).then(result => {
          if (result.success) {
            this.$message.success(result.message);
            this.query();
          } else
            this.$message.error(result.message);

        });
      }).catch(() => {
      });

    },
    query() {
      getMenuList("mobile").then(result => {
        this.data = result.data;
        // 获取所有一级菜单,用于设置父菜单下拉选择框
        const parent = [];
        for (const resultElement of this.data) {
          parent.push({
            label: resultElement.menuName,
            value: resultElement.id
          });
        }
        this.dic = parent;
      });
      bindIconSelect().then(result => {
        this.iconList = result.data;
      });
    },
    beforeOpen(done, type) {
      if (type === "add") {
        this.menu = {};
      }
      done();
    },
  },
  created() {
    this.query();
  },
  mounted() {
    this.$utils.resetHeight(0, this.option);
  }
};

</script>

<style>

</style>
