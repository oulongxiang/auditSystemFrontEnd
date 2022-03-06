<template>
    <basic-container>
        <avue-crud
            :data="data"
            :page.sync="page"
            :search.sync="search"
            :option="option"
            :table-loading="loading"
            @search-change="searchChange"
            @current-change="currentChange"
            @size-change="sizeChange"
            @sort-change="sortChange">

            <template slot-scope="{disabled,size}" slot="createTimeSearch">
                <el-date-picker
                    v-model="search.createTime"
                    type="daterange"
                    align="center"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"/>
            </template>

        </avue-crud>
    </basic-container>
</template>

<script>
import { getOperationLogList } from "@/api/userApi";
import { getDictList, getDictListToType } from "@/api/systemApi";

export default {
  name: "OperationLog",
  props: ["userId"],
  data() {
    return {
      page: {
        pageSize: 30,
      }, // 分页配置 【默认 第1页 每页30条数据】
      sort: {
        sort: "b.create_time",
        order: false,
      }, // 排序配置 【默认 无排序】
      search: {}, // 搜索绑定
      data: [], // 请求获取后的数据
      queryParams: {}, // 用于保存查询条件
      loading: false, // 表格数据是否加载中
      option: { // 表格配置
        border: true, // 表格显示边框
        stripe: true, // 表格显示斑马纹
        menu: false, // 取消菜单
        height: 600,
        searchMenuSpan: 6,
        header: false,
        column: [
          {
            label: "用户名", // 表头标题
            prop: "userName", // 对应后端相应的字段名
            width: 160, // 单元格最小宽度
            search: true,
            searchSpan: 4,
          },
          {
            label: "请求类型",
            prop: "requestType",
            width: 100,
            type: "select",
            search: true,
            searchSpan: 6,
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: getDictList("requestType")
          },
          {
            label: "请求参数",
            prop: "requestParam",
            overHidden: true, // 内容超出单元格时是否隐藏
            minWidth: 220,
          },
          {
            label: "操作",
            prop: "operation",
            width: 400,
            search: false,
          },
          {
            label: "浏览器",
            prop: "browser",
            overHidden: true, // 内容超出单元格时是否隐藏
            minWidth: 220,
          },
          {
            label: "操作系统",
            prop: "operatingSystem",
            width: 150,
          },
          {
            label: "ip地址",
            prop: "ipAddress",
            width: 150,
          },
          {
            label: "操作时间",
            prop: "createTime",
            width: 135,
            type: "date", // 类型为时间格式
            format: "yyyy-MM-dd HH:mm", // 时间格式化
            search: true,
            sortable: "custom",
            orderProp: "b.create_time",
            searchSpan: 8,
          },
        ]
      },
      loginTypeOptions: [],
      pickerOptions: {
        shortcuts: [{
          text: "最近一周",
          onClick(picker) {
            const end = new Date(), start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          }
        }, {
          text: "最近一个月",
          onClick(picker) {
            const end = new Date(), start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          }
        }, {
          text: "最近三个月",
          onClick(picker) {
            const end = new Date(), start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit("pick", [start, end]);
          }
        }]
      },
    };
  },
  methods: {
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
    /**
     * 查询数据
     * @param params 查询条件 (可穿)
     * @param done   控制搜索转圈（可选）
     */
    query(params, done) {
      // 设置表格加载中
      this.loading = true;
      if (params && params.createTime) {
        params.beginLoginDate = this.$utils.formatDate(params.createTime[0], "yyyy-MM-dd");
        params.endLoginDate = this.$utils.formatDate(params.createTime[1], "yyyy-MM-dd");
        delete params.createTime;
      }
      // 将条件，分页，排序拼接起来用作发给后端的参数
      this.queryParams = params;
      const queryData = this.$utils.getQueryParam(this.queryParams, this.page, this.sort);
      if (this.userId) {
        queryData.userId = this.userId;
        delete queryData.userName;
      }
      // 向后端发起请求，获取数据
      getOperationLogList(queryData).then(result => {
        // 请求数据成功,设置表格数据和分页
        this.data = result.data;
        this.page.total = result.page.total;
      }).finally(() => {
        // 不管失败还是成功，都把表格设置为加载完毕
        this.loading = false;
        if (done) done();
      });
    },
    /**
     * 点击某个字段排序后触发 设置前端排序与后端排序一致
     * @param val 排序的字段等信息
     */
    sortChange(val) {
      // 封装成后端可用的排序参数
      this.sort = this.$utils.getSortParam(val, this.option);
      this.query(this.queryParams);
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
  },
  created() {
    getDictListToType("LoginTypeEnum").then(result => {
      result.data.forEach(item => {
        item["label"] = item["value"];
        item["value"] = item["code"];
      });
      this.loginTypeOptions = result.data;
    });
  },
  mounted() {
    if (this.userId) {
      this.option.column[0].search = false;
      this.option.height = 500;
    }
    this.query();
  },
  watch: {
    userId: function(val) {
      this.userId = val;
      this.search = {};
      this.query();
    }
  }
};
</script>

<style scoped>

</style>
