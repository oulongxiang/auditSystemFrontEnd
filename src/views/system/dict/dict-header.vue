<template>
    <basic-container>
        <avue-crud
            :data="tableSource"
            :option="option"
            :page.sync="page"
            :search.sync="search"
            :table-loading="loading"
            @search-change="searchChange"
            @row-update="rowUpdate"
            @row-save="rowSave"
            @current-change="currentChange"
            @size-change="sizeChange">
            <template slot-scope="scope" slot="menu">
                <el-button
                    class="el-button el-button--text el-button--small"
                    icon="el-icon-delete"
                    type="text"
                    size="small"
                    @click="rowDel(scope.row)">删除
                </el-button>
                <el-button
                    class="el-button el-button--text el-button--small"
                    icon="el-icon-delete"
                    type="text"
                    size="small"
                    @click="cheackDictDetail(scope.row)">字典项
                </el-button>
            </template>
        </avue-crud>
        <el-dialog
            append-to-body
            :visible.sync="detailVisable"
            v-if="detailVisable"
            width="50%"
            top="5vh"
            :title="detailTitle">
            <dict :type="typeId"/>
        </el-dialog>
    </basic-container>
</template>

<script>
import { addOrUpdateDictType, delDictType, listDictTypeData } from "@/api/systemApi";
import dict from "@/views/system/dict/dict";

export default ({
  components: {
    dict
  },
  data() {
    return {
      page: {
        // 当前页
        currentPage: 1,
        // 每页容量
        pageSize: 10,
      },
      // 表格数据
      tableSource: [],
      // 搜索框配置
      search: {},
      // 加载状态
      loading: false,
      // 明细框标题
      detailTitle: "",
      // 表格配置
      option: {
        align: "center",
        // 设置搜索按钮与筛选条件在同一行
        searchMenuSpan: 6,
        // 删除按钮可见性
        delBtn: false,
        // 操作菜单的宽度默认240
        menuWidth: 300,
        // 列名配置
        column: [
          {
            label: "类型",
            search: true,
            editDisplay: false,
            prop: "name",
          },
          {
            label: "描述",
            search: true,
            prop: "explain"
          },
          {
            label: "备注",
            search: true,
            prop: "describe"
          },
          {
            label: "创建时间",
            addDisplay: false,
            editDisplay: false,
            prop: "createTime"
          }
        ],
      },
      // 排序字段
      sort: "",
      // 明细框可见性
      detailVisable: false,
      // 该变量用来传递字典的ID到字典明细中
      typeId: "",
    };
  },
  created() {
    // 页面加载默认加载数据
    this.query();
  },
  methods: {

    /**
     * @description: 页面容量变更事件
     * @param {*} pageSizeChange
     * @return {*}
     */
    sizeChange(pageSizeChange) {
      this.page.currentPage = 1;
      this.page.pageSize = pageSizeChange;
      this.query();
    },

    /**
     * @description: 翻页调用函数
     * @param {*}
     * @return {*}
     */
    currentChange(currentChange) {
      this.page.currentPage = currentChange;
      this.query();
    },


    /**
     * @description: 行内删除（逻辑删除）需要级联删除明细项
     * @param {*} row
     * @return {*}
     */
    rowDel(row) {
      this.$confirm("确定删除【" + row.name + "】该类型？", "提示").then(() => {
        this.loading = true;
        delDictType(row.id).then(res => {
          if (res.success) {
            this.$message.success("删除成功");
          }
        }).finally(() => {
          this.query();
          this.loading = false;
        });
      });
    },

    /**
     * @description: 搜索按钮点击事件
     * @param {*}
     * @return {*}
     */
    searchChange(params, done) {
      this.query();
      done();
    },

    /**
     * @description: 调用查询接口
     * @param {*}
     * @return {*}
     */
    query() {
      // 封装查询函数
      const endQueryData = this.$utils.getQueryParam(this.search, this.page, this.sort);
      listDictTypeData(endQueryData).then(res => {
        if (res.success) {
          this.tableSource = res.data;
          this.page = res.page;
        }
      });
    },

    /**
     * @description: 行内点击字典项处理事件
     * @param {*}
     * @return {*}
     */
    cheackDictDetail(row) {
      this.typeId = row.id;
      this.detailTitle = row.explain;
      this.detailVisable = true;
    },

    /**
     * @description: 行内编辑事件
     * @param {*}
     * @return {*}
     */
    rowUpdate(row, index, done) {
      addOrUpdateDictType(row).then(res => {
        if (res.success) {
          this.$message.success("操作成功");
        }
      }).finally(() => {
        if (done) {
          done();
          this.query();
          this.loading = false;
        }
      });
    },

    /**
     * @description: 新增界面点击保存后执行事件
     * @param {*}
     * @return {*}
     */
    rowSave(row, done) {
      addOrUpdateDictType(row).then(res => {
        if (res.success) {
          this.$message.success("操作成功");
        }
      }).finally(() => {
        if (done) {
          done();
          this.query();
          this.loading = false;
        }
      });
    },


  }


});
</script>
<style scoped>

</style>
