<template>
    <basic-container>
        <avue-crud
            :option="option"
            :data="data"
            @row-save="rowSave"
            @search-change="searchChange"
            @row-del="rowDel"
            @row-update="rowUpdate"
            @size-change="sizeChange"
            @current-change="currentChange"
            :search.sync="keyword"
            :page.sync="page"
            :table-loading="loading">
            <template slot-scope="scope" slot="typeExplainForm">
                <el-input v-model="dicData.typeExplain"/>
            </template>

        </avue-crud>
    </basic-container>
</template>
<script>

import { addOrUpdateDict, delDict, getDictAdd, getDictList } from "@/api/systemApi";

export default {
  name: "Dict",
  props: {
    type: String
  },
  data() {
    return {
      loading: true,
      page: {},
      dicData: {},
      queryData: {},
      keyword: {},
      dictAddList: {},
      data: [],
      option: {
        headerAlign: "center",
        align: "center",
        border: true,
        index: false,
        defaultExpandAll: true,
        addBtn: true,
        searchMenuSpan: 6,
        height: 420,
        dialogDrag: true,
        column: [
          {
            label: "字典编码",
            prop: "code",
            align: "left",
            search: true,
            editDisplay: false,
            rules: [{
              required: true,
              message: "请填写字典编码",
              trigger: "blur"
            }]
          },
          {
            label: "实际值",
            prop: "value",
            align: "left",
            rules: [{
              required: true,
              message: "请填写实际值",
              trigger: "blur"
            }]
          },
          {
            label: "备注",
            prop: "explain",
            align: "left",
            search: true,
            fromslot: true,
          },
          {
            label: "排序",
            prop: "sort",
            align: "left",
            minWidth: 60,
            value: 0,
            type: "number",
            rules: [{
              required: true,
              message: "请填写排序值",
              trigger: "blur"
            }]
          }
        ],
      },
    };
  },
  created() {
    this.bindDict();
    this.loadData();
  },
  methods: {

    /**
     * @description: 调用查询接口
     * @param {*} params
     * @param {*} done
     * @return {*}
     */
    loadData(params, done) {
      this.queryData = params;
      this.loading = true;
      // chb begin  把接收到的表头ID添加到查询条件里
      console.log("接收到的表头ID");
      console.log(this.type);
      if (this.queryData) {
        Object.assign(this.queryData, { type: this.type });
      } else {
        const mark = { type: this.type };
        Object.create(mark);
        this.queryData = mark;
      }
      // chb end
      getDictList(this.getQueryData(this.queryData)).then((result) => {
        this.page.total = result.page.total;
        this.data = result.data;
      }).finally(() => {
        if (done)
          done();
        this.loading = false;
      });
    },
    bindDict() {
      getDictAdd().then((result) => {
        this.dictAddList = result.data;
      });
    },

    searchChange(params, done) {
      this.page.currentPage = 1;
      this.loadData(params, done);
    },
    rowDel(form) {
      this.$confirm("确认删除?").then(() => {
        delDict(form.id).then(result => {
          this.$message.success(result.message);
          this.loadData(this.queryData);
          this.bindDict();
        });
      });
    },

    /**
     * @description: 新增界面保存按钮点击后处理事件
     * @param {*} form
     * @param {*} done
     * @param {*} loading
     * @return {*}
     */
    rowSave(form, done, loading) {
      if (form) {
        Object.assign(form, { type: this.type });
      }
      addOrUpdateDict(this.$jsonUtil.clearBlankDate(form)).then(result => {
        this.$message.success(result.message);
        this.loadData(this.queryData);
        this.bindDict();
        done();
      }).finally(() => {
        loading();
      });
    },

    /**
     * @description: 行内编辑按钮点击保存后
     * @param {*} form
     * @param {*} index 当前页
     * @param {*} done  判断事件是否完成 影响到按钮转圈圈效果
     * @param {*} loading 表格加载效果
     * @return {*}
     */
    rowUpdate(form, index, done, loading) {
      if (form) {
        Object.assign(form, { type: this.type });
      }
      console.log(index);
      addOrUpdateDict(this.$jsonUtil.clearBlankDate(form)).then(result => {
        this.$message.success(result.message);
        this.loadData(this.queryData);
        this.bindDict();
        done();
      }).finally(() => {
        loading();

      });
    },
    // 更改每页个数
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.loadData(this.queryData);
    },
    // 更改当前页数
    currentChange(val) {
      this.page.currentPage = val;
      this.loadData(this.queryData);
    },
    getQueryData(params = {}) {
      return this.$jsonUtil.mergeJsonObject({
        pageSize: this.page.pageSize,
        currentPage: this.page.currentPage
      }, params);
    },
  },

  mounted() {
    // 动态调整表格高度
    // this.$utils.resetHeight(0,this.option)
  }
};
</script>
<style scoped>
</style>
