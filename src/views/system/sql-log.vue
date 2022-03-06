<template>
    <basic-container>
        <avue-crud
            :option="option"
            :data="data"
            :table-loading="loading"
            :page.sync="page"
            @search-change="searchChange"
            ::table-loading="loading"
            @size-change="sizeChange"
            @current-change="currentChange"
            @sort-change="sortChange"
            @refresh-change="refreshData"
            :search.sync="search">


            <template slot-scope="{disabled,size}" slot="operationTimeSearch">
                <el-date-picker
                    v-model="search.operationTime"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"/>
            </template>

        </avue-crud>
    </basic-container>
</template>

<script>
import { getSqlOperationList } from "@/api/systemApi";

export default {
  data() {
    return {
      search: {},
      sort: {},
      queryData: {},
      loading: false,
      data: [],
      option: {
        border: true,
        index: true,
        header: false,
        indexLabel: "序号",
        filterBtn: false,
        searchBtn: true,
        emptyBtn: false,
        addBtn: false,
        align: "center",
        menuWidth: 150,
        height: 600,
        menu: false,
        searchMenuSpan: 6,
        column: [
          { label: "姓名", prop: "name", maxWidth: 80, search: true, },
          {
            label: "操作类型",
            maxWidth: 80,
            prop: "logLevel",
            type: "select",
            search: true,
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: getDictList("sqlOperation")
          },
          {
            label: "操作(日志记录)时间",
            prop: "operationTime",
            orderProp: "operation_time",
            searchLabelWidth: 140,
            minWidth: 150,
            maxWidth: 150,
            search: true,
            sortable: "custom",
            searchslot: true,
            overHidden: true,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            type: "date",
          },
          { label: "内容", maxWidth: 250, minWidth: 250, prop: "content", overHidden: true, },
          { label: "包名", prop: "callerPackageName", overHidden: true, },
        ]

      },
      page: {},
    };
  },
  methods: {
    formatDate(date, pattern) {
      return this.$utils.formatDate(date, pattern);
    },
    searchChange(params, done) {
      this.page.currentPage = 1;
      this.query(params, done);
    },
    query(params, done) {
      this.loading = true;
      if (params.name) {
        params.operatorName = params.name;
      }
      if (params.logLevel) {
        params.operatorType = params.logLevel;
      }
      if (params.operationTime) {
        params.beginDate = params.operationTime[0];
        params.endDate = params.operationTime[1];
      }
      this.queryData = params;
      delete this.queryData.name;
      delete this.queryData.logLevel;
      delete this.queryData.operationTime;
      getSqlOperationList(this.$utils.getQueryParam(this.queryData, this.page, this.sort)).then((result) => {
        this.page = result.page;
        this.data = result.data;
        if (done)
          done();
        this.loading = false;
      });
    },
    getQueryData(params = {}) {
      return this.mergeJsonObject({ pageSize: this.page.pageSize, currentPage: this.page.currentPage }, params);
    },
    sortChange(val) {
      this.sort = this.$utils.getSortParam(val, this.option);
      this.query(this.queryData);
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
    refreshData() {
      this.query(this.queryData);
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.query(this.queryData);
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.query(this.queryData);
    },
  },
  mounted() {
    this.$utils.resetHeight(0, this.option);
  },
  created() {
    this.sort = this.$utils.getSortParam({
      prop: "operationTime",
      orderProp: "operation_time",
      order: "descending"
    }, this.option);
    this.page.currentPage = 1;
    this.page.pageSize = 30;
    this.query(this.queryData);
  }
};
</script>

<style scoped>

</style>

