<template>
    <basic-container>
        <avue-crud
            :option="option"
            :data="data"
            :search.sync="keyword"
            ref="crud"
            @row-save="handleSave"
            @row-update="handleUpdate"
            @row-del="rowDel"
            @search-change="searchChange"
            @current-change="currentChange"
            @size-change="sizeChange"
            @refresh-change="refreshChange"
            :page.sync="page"
            :table-loading="loading">

            <template slot-scope="scope" slot="menuLeft">
                <el-button type="primary" icon="el-icon-plus" size="small" plain @click.stop="$refs.crud.rowAdd()">新增
                </el-button>
            </template>

            <template slot-scope="{row,index, size, type}" slot="menu">
                <el-button
                    :type="type"
                    icon="el-icon-edit"
                    :size="size"
                    @click.stop="$refs.crud.rowEdit(row,index,loading)">编辑
                </el-button>
                <el-button :type="type" icon="el-icon-delete" :size="size" @click.stop="$refs.crud.rowDel(row,index)">
                    删除
                </el-button>
            </template>


            <template slot-scope="scope" slot="parentNameSearch">
                <el-select v-model="keyword.parentOrgId" clearable filterable>
                    <el-option
                        v-for="item in parentNameList"
                        :key="item.org_id"
                        :label="item.org_name"
                        :value="item.org_id"/>
                </el-select>
            </template>

            <template slot-scope="scope" slot="parentNameForm">
                <el-select v-model="scope.row.parentOrgId" clearable filterable>
                    <el-option
                        v-for="item in parentNameList"
                        :key="item.org_id"
                        :label="item.org_name"
                        :value="item.org_id"/>
                </el-select>
            </template>

            <template slot-scope="scope" slot="riskDirectorNameForm">
                <el-select v-model="scope.row.riskDirectorId" clearable filterable>
                    <el-option
                        v-for="item in riskDirectorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
            </template>


        </avue-crud>
    </basic-container>
</template>

<script>

import { mapGetters } from "vuex";
import { addOrgOutOrUpdate, bindParentIdList, delOrgOut, getOrgOut } from "@/api/systemApi";
import { bindSubordinateUserSelect } from "@/api/userApi";

export default {
  data() {
    return {
      loading: false, // 是否开启表格数据加载中
      queryParams: {}, // 查询条件参数
      parentNameList: [],
      keyword: {},
      page: {}, // 分页相关参数
      sort: {}, // 排序相关参数
      data: [], // 表格数据
      option: { // 表格参数设置
        menu: true,
        delBtn: false,
        dialogDrag: true,
        editBtn: false,
        addBtn: false,
        searchMenuSpan: 6,
        column: [ // 表格列设置
          {
            label: "组织名称", // 列头名
            prop: "orgName", // 对应的列字段名
            align: "left", // 左对齐
            searchSpan: 4,
            search: true, // 开启参数搜索
            rules: [{
              required: true,
              message: "请输入组织名称",
              trigger: "blur"
            }]
          },
          {
            label: "上级组织", // 列头名
            prop: "parentName", // 对应的列字段名
            align: "left", // 左对齐
            searchSpan: 6,
            search: true,
            fromslot: true,
            searchslot: true,
          },
          {
            label: "缩写编码", // 列头名
            search: true,
            prop: "abridgeCode", // 对应的列字段名
            searchSpan: 4,
          },
          {
            label: "风险负责人", // 列头名
            searchLabelWidth: 100,
            search: true,
            formslot: true,
            searchSpan: 4,
            prop: "riskDirectorName", // 对应的列字段名
          },
          {
            label: "说明", // 列头名
            prop: "description", // 对应的列字段名
            searchSpan: 3,
          },
          {
            label: "创建时间", // 列头名
            prop: "createTime", // 对应的列字段名
            addDisplay: false,
            editDisplay: false,
          }
        ]
      },
      riskDirectorOptions: [],
    };
  },
  methods: {
    bindParentName() {
      bindParentIdList().then(result => {
        this.parentNameList = result.data;
      });
    },
    handleSave(form, done, loading) {
      addOrgOutOrUpdate(form).then(() => {
        this.query(this.queryParams);
        this.$message.success("操作成功");
        // 取消禁用搜索菜单
        done();

      }).finally(() => {
        loading();

      });
    },
    handleUpdate(form, index, done, loading) {
      addOrgOutOrUpdate(form).then(() => {
        this.query(this.queryParams);
        this.$message.success("操作成功");
        // 取消禁用搜索菜单
        done();
      }).finally(() => {
        loading();

      });
    },
    rowDel(row) {
      this.$confirm("确认删除此组织机构?").then(() => {
        this.loading = true;
        delOrgOut(row.id).then(() => {
          this.query(this.queryParams);
          this.loading = false;
          this.$message.success("删除成功");
        });
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
      // 设置查询条件
      this.queryParams = params;
      // 拼接查询条件+分页参数+排序参数
      const queryData = this.$utils.getQueryParam(this.queryParams, this.page, this.sort);
      // 发起请求获取数据并设置分页
      getOrgOut(queryData).then(result => {
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


  },
  created() {
    this.bindParentName();
    this.query();
    bindSubordinateUserSelect().then(result => {
      this.riskDirectorOptions = result.data;
    });
  },
  mounted() {
    // 动态调整表格高度
    this.$utils.resetHeight(0, this.option);
  },
  computed: {
    ...mapGetters(["userInfo"]),
  }
};
</script>

<style scoped>

</style>
