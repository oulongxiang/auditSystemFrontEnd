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
            <template slot-scope="{ row, index, size, type }" slot="menu">
                <el-button :size="size" :disabled="row.stackTrace===null" :type="type" @click="openStackTrace(row)">
                    查询详细堆栈信息
                </el-button>
            </template>


        </avue-crud>
        <el-dialog
            v-dialogdrag
            top="5vh"
            width="75%"
            title="详细堆栈信息"
            append-to-body
            :visible.sync="stackTraceDialogVisible"
            :beforeClose="closeStackTrace">
            <template>
                <el-row>
                    <template>
                        <div id="stackTrace" style="background-color: #4695da ;color: #b95c5d"/>
                    </template>
                </el-row>
            </template>
        </el-dialog>
    </basic-container>
</template>

<script>
import Editor from "wangeditor";
import { getDictList, getSystemLogList } from "@/api/systemApi";

export default {
  data() {
    return {
      search: {},
      sort: {},
      queryData: {},
      stackTraceDialogVisible: false,
      stackTraceList: {},
      editor: null,
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
        editBtn: false,
        delBtn: false,
        menuWidth: 150,
        height: 600,
        menu: true,
        searchMenuSpan: 6,
        column: [
          {
            label: "日志类型",
            prop: "errType",
            type: "select",
            searchSpan: 6,
            searchClearable: false,
            hide: true,
            searchValue: 1,
            search: true, // 开启参数搜索
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: getDictList("errType"),
            value: true,
            change: (value) => {
              let a;
              if (value.value === 1) {
                this.option.column[1].hide = false;
                this.option.column[1].search = true;
                a = { errType: 1 };
                this.query(a);
              } else if (value.value === 2) {
                this.option.column[1].hide = true;
                this.option.column[1].search = false;
                a = { errType: 2 };
                this.query(a);
              }
            }
          },
          {
            label: "姓名", prop: "name", search: true
          },
          { label: "日志级别", prop: "logLevel" },
          {
            label: "操作(日志记录)时间",
            prop: "operationTime",
            orderProp: "operation_time",
            searchLabelWidth: 140,
            minWidth: 150,
            searchSpan: 6,
            search: true,
            sortable: "custom",
            searchslot: true,
            overHidden: true,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            type: "date",
          },
          { label: "日志内容", minWidth: 250, prop: "content", overHidden: true, },
          { label: "打印日志的包名", minWidth: 150, prop: "callerPackageName", overHidden: true, },
          { label: "打印日志的方法名", minWidth: 150, prop: "callerMethodName", overHidden: true },
          { label: "打印日志的行数", maxWidth: 50, prop: "callerLine" }
        ]

      },
      page: {},
    };
  },
  components: {
    Editor
  },
  methods: {
    openStackTrace(row) {
      let stackTraceHtml = "";
      row.stackTrace.trim().split("\n").forEach(function(v) {
        let line = v;
        if (v.indexOf("com.tul") !== -1 && v.indexOf("java:") !== -1) {
          const begin = v.lastIndexOf("("), end = v.lastIndexOf(")");
          if (begin !== -1 && end !== -1) {
            const crux = "<font color='#4695DA'>" + v.substring(begin, end + 1) + "</font>";
            line = v.substring(0, begin) + crux;
          }
        }
        stackTraceHtml += "<pre style='font-size: 15px'>" + line + "</pre>";
      });
      // 打开弹窗
      this.stackTraceDialogVisible = true;
      setTimeout(() => {
        this.editor = new Editor("#stackTrace");
        this.editor.config.height = 650;
        this.editor.config.excludeMenus = [
          "head",
          "bold",
          "fontSize",
          "fontName",
          "italic",
          "underline",
          "strikeThrough",
          "indent",
          "lineHeight",
          "foreColor",
          "backColor",

          "link",
          "list",
          "todo",
          "justify",
          "quote",
          "emoticon",
          "image",
          "video",
          "table",
          "code",
          "splitLine",
          "undo",
          "redo",
        ];
        this.editor.config.foreColor = "#2b2b2b";
        this.editor.create();
        this.editor.txt.html(stackTraceHtml);
        this.editor.disable();
      }, 100);

    },
    // 关闭弹窗
    closeStackTrace() {
      this.stackTraceDialogVisible = false;
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy();
      this.editor = null;
    },
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
      if (params.operationTime) {
        params.beginDate = params.operationTime[0];
        params.endDate = params.operationTime[1];
      }
      this.queryData = params;
      delete this.queryData.name;
      delete this.queryData.operationTime;
      getSystemLogList(this.$utils.getQueryParam(this.queryData, this.page, this.sort)).then((result) => {
        this.page = result.page;
        this.data = result.data;
        if (done)
          done();
        this.loading = false;
      });
    },
    sortChange(val) {
      this.sort = this.$utils.getSortParam(val, this.option);
      this.query(this.queryData);
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
  created() {
    this.sort = this.$utils.getSortParam({
      prop: "operationTime",
      orderProp: "operation_time",
      order: "descending"
    }, this.option);
    this.page.currentPage = 1;
    this.page.pageSize = 30;
    this.query({ errType: 1 });
  },
  mounted() {
    this.$utils.resetHeight(0, this.option);
  }
};
</script>

<style>
.box {
    width: 100%;
    height: 1000px;
    border: 0;
    resize: none;
}


.box >>> .el-textarea__inner {
    border: 0;
    resize: none; /* 这个是去掉 textarea 下面拉伸的那个标志，如下图 */
}

.w-e-content-mantle {
    width: 100%;
    height: 100%;
    background-color: #2b2b2b;
    overflow-y: auto;
}
</style>


