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


            <template slot-scope="{disabled,size}" slot="createTimeSearch">
                <el-date-picker
                    v-model="search.createTime"
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
import { getApiLogList, getDictList } from "@/api/systemApi";

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
        menuWidth: 100,
        searchMenuSpan: 6,
        menu: false,
        column: [
          {
            label: "请求时间",
            prop: "createTime",
            overHidden: true,
            sort: true,
            sortable: "custom",
            orderProp: "create_time",
            searchslot: true,
            search: true,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            type: "date",
          },
          {
            label: "Api类型",
            type: "select",
            prop: "type",
            searchSpan: 4,
            search: true,
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: getDictList("apiLogType")
          },
          {
            label: "请求参数",
            prop: "param",
            searchSpan: 4,
            search: true,
            overHidden: true,
          },
          {
            label: "请求响应结果",
            prop: "result",
            overHidden: true,
          },
          {
            label: "备注",
            prop: "remark",
            overHidden: true,
          },
          {
            label: "是否成功",
            prop: "responseState",
            searchSpan: 3,
            type: "select",
            search: true,
            hide: true,
            overHidden: true,
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: getDictList("general")
          },
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
      // 当选择了创建时间后对创建时间分割成startTime和endTime
      if (params.createTime) {
        params.startTime = params.createTime[0];
        params.endTime = params.createTime[1];
      }
      this.queryData = params;
      // 删除createTime
      delete this.queryData.createTime;
      getApiLogList(this.$utils.getQueryParam(this.queryData, this.page, this.sort)).then((result) => {
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
      prop: "createTime",
      orderProp: "create_time",
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

