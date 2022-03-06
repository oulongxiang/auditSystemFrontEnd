<template>
    <basic-container>
        <avue-crud
            ref="mainForm"
            :page.sync="page"
            v-model="formData"
            :search.sync="search"
            :data="data"
            :option="option"
            :table-loading="loading"
            @search-change="searchChange"
            @refresh-change="query()"
            @selection-change="selectionChange"
            @size-change="sizeChange"
            @current-change="currentChange">
            <!--自定义菜单-->
            <template slot="menuLeft" slot-scope="{size}">
                <el-button size="small" @click="batchDownloadCode()" type="success">批量下载</el-button>
            </template>

            <!--自定义操作栏-->
            <template slot-scope="{row, index, size, type}" slot="menu">
                <el-button @click="showColumns(row)" size="mini" type="info">字段</el-button>
                <el-button @click="genCode(row)" size="mini" type="success">生成</el-button>
            </template>
        </avue-crud>


        <!--预览代码-->
        <el-dialog
            :title="preview.title"
            :visible.sync="preview.open"
            width="80%"
            top="5vh"
            append-to-body>
            <el-tabs v-if="preview.open" v-model="activeName" type="card">
                <el-tab-pane v-for="item in tabData" :key="item.k" :lazy="true" :label="item.k" :name="item.k">
                    <Java :value="item.v" height="600px"/>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <!--字段信息-->
        <el-dialog
            :title="columns.title"
            :visible.sync="columns.open"
            width="80%"
            top="5vh"
            append-to-body>
            <avue-crud :data="columnsData" :option="columnsOption"/>
        </el-dialog>

        <!--生成/预览前的配置-->
        <el-dialog :visible.sync="box" title="生成配置" width="50%" lock-scroll>
            <div class="pull-auto">
                <avue-form ref="formData" :option="formOption" v-model="formData">
                    <template slot-scope="scope" slot="menuForm">
                        <el-button
                            v-if="showPreviewButton"
                            type="primary"
                            icon="el-icon-view"
                            plainformData
                            @click="previewCode()">预览
                        </el-button>
                        <el-button
                            type="info"
                            icon="el-icon-check"
                            plain
                            @click="downloadCode()">下载
                        </el-button>
                    </template>
                </avue-form>
            </div>
        </el-dialog>


    </basic-container>
</template>

<script>
import {
  batchDownloadCode,
  downloadCode,
  getColumnList,
  getDbNameList,
  getTableList,
  previewCode
} from "@/api/genCodeApi";
import Java from "@/components/editor/index";

export default {
  data() {
    return {
      // 表格相关参数
      page: {}, // 分页配置 【默认 第1页 每页10条数据】
      selectionIdList: [], // 多选选中的行数据
      data: [], // 请求获取后的数据
      formData: {}, // 表单
      queryParams: {}, // 用于保存查询条件
      loading: false, // 表格数据是否加载中
      serviceList: [], // 业务列表
      option: { // 表格配置
        border: true, // 表格显示边框
        stripe: true, // 表格显示斑马纹
        addBtn: false,
        editBtn: false, // 取消行内编辑 (用自定义的)
        delBtn: false, // 取消行内删除 (用自定义的)
        selection: true, // 表格开启多选
        menuWidth: 180, // 行内菜单宽度
        searchMenuSpan: 6,
        column: [
          {
            label: "数据源名",
            prop: "dbName",
            minWidth: 210,
            type: "select",
            search: true,
            overHidden: true,
            hide: true,
            searchValue: "audit",
            searchClearable: false,
            dicData: []
          },
          {
            label: "表名",
            prop: "tableName",
            minWidth: 210,
            overHidden: true,
            search: true,
            fixed: true,
            searchLabelWidth: 100,
            labelWidth: 110,
          },
          {
            label: "描述",
            prop: "tableComment",
            minWidth: 210,
            overHidden: true,
          },
          {
            label: "创建时间",
            prop: "createTime",
            type: "date",
            format: "yyyy-MM-dd HH:mm", // 时间格式化
            minWidth: 135,
            addDisplay: false,
            editDisplay: false,
          },
        ],
        showPreviewButton: true,
      },
      search: {},
      // 预览参数
      preview: {
        open: false,
        title: "代码预览"
      },
      activeName: "Entity.java",
      tabData: [],
      // 字段参数
      columns: {
        open: false,
        title: "表字段"
      },
      columnsData: [],
      columnsOption: {
        border: true, // 表格显示边框
        stripe: true, // 表格显示斑马纹
        addBtn: false,
        editBtn: false, // 取消行内编辑 (用自定义的)
        delBtn: false, // 取消行内删除 (用自定义的)
        header: false,
        menu: false,
        height: 600,
        column: [
          {
            label: "字段名",
            prop: "columnName",
          },
          {
            label: "字段注释",
            prop: "columnComment",
            width: 400,
          },
          {
            label: "字段类型",
            prop: "columnType",
          },
          {
            label: "主键",
            prop: "columnKey",
          },
          {
            label: "是否为空",
            prop: "isNullable",
          },
          {
            label: "补充说明",
            prop: "extra",
          }

        ]
      },
      box: false,
      row: {},
      formOption: {
        submitBtn: false,
        emptyBtn: false,
        submitText: "生成",
        column: [
          {
            label: "表名称",
            prop: "tableName",
            disabled: true
          }, {
            label: "包名",
            prop: "packageName",
            placeholder: "可为空，加载系统默认配置"
          }, {
            label: "作者",
            prop: "author",
            placeholder: "可为空，加载系统默认配置"
          }, {
            label: "模块",
            prop: "moduleName",
            placeholder: "可为空，加载系统默认配置"
          }, {
            label: "表前缀",
            prop: "tablePrefix",
            placeholder: "可为空，加载系统默认配置"
          }, {
            label: "注释",
            prop: "comments",
            placeholder: "可为空，加载表备注"
          }, {
            label: "风格",
            prop: "style",
            type: "radio",
            border: true,
            span: 24,
            dicData: [{
              label: "基础模板",
              value: "0"
            }, {
              label: "通用接口模板",
              value: "1"
            }]
          }
        ]
      }
    };
  },
  components: { Java },
  methods: {
    /**
     * 查询数据
     * @param params 查询条件 (可穿)
     * @param done   控制搜索转圈（可选）
     */
    query(params, done) {
      // 设置表格加载中
      this.loading = true;
      if (!params) {
        params = { dbName: "audit" };
      }
      this.queryParams = params;
      const queryData = this.$utils.getQueryParam(this.queryParams, this.page, this.sort);
      // 向后端发起请求，获取数据
      getTableList(queryData).then(result => {
        // 请求数据成功,设置表格数据和分页
        this.data = result.data;
        this.page.total = result.page.total;
        // 一般只有点击搜索时会传入改参数,用于禁用搜索菜单
        if (done) {
          // 取消禁用搜索菜单
          done();
        }
      }).finally(() => {
        // 不管失败还是成功，都把表格设置为加载完毕
        this.loading = false;
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
      this.query(params, done);
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
     * 选中表格行
     * @param list 当前多选选中的数据
     */
    selectionChange(list) {
      this.selectionIdList = list;
    },
    /**
     * 预览代码
     */
    previewCode() {
      this.activeName = "Entity.java";
      this.preview.title = "【" + this.row.tableName + "】 " + this.row.tableComment;
      if (!this.search.dbName) return;
      this.formData.dbName = this.search.dbName;
      this.formData.tableName = this.row.tableName;
      previewCode(this.formData).then(res => {
        const map = res.data, data = [];
        for (const key in map) {
          let k;
          if (this.formData.style === "0") {
            k = key.replace(/^template\/dynamic\/basic\/|.vm$/g, "");
          }
          if (this.formData.style === "1") {
            k = key.replace(/^template\/dynamic\/crud\/|.vm$/g, "");
          }
          const v = map[key], obj = { k, v };
          data.push(obj);
        }
        this.tabData = this.codeSort(data);
      });
      this.preview.open = true;
    },
    showColumns(row) {
      this.columns.title = "【" + row.tableName + "】 " + row.tableComment;
      getColumnList(this.search.dbName, row.tableName).then(res => {
        this.columnsData = res.data;
        this.columns.open = true;
      });
    },
    genCode(row) {
      this.showPreviewButton = true;
      this.row = row;
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = "";
      });
      this.formData.style = "0";
      this.formData.tableName = row.tableName;
      this.box = true;
    },
    batchDownloadCode() {
      if (this.selectionIdList.length === 0) {
        this.$message.error("您未选中任何表");
        return;
      }
      if (this.selectionIdList.length > 30) {
        this.$message.error("选择的表过多，请不要批量生成30张以上的表");
        return;
      }
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = "";
      });
      this.formData.style = "0";
      this.showPreviewButton = false;
      this.box = true;
      let tableNames = [];
      for (const row of this.selectionIdList) {
        tableNames.push(row.tableName);
      }
      if (tableNames.length === 0) return;
      tableNames = tableNames.join(",");
      this.formData.tableName = tableNames;
      this.formData.dbName = this.search.dbName;
      this.formData.tableNames = tableNames;
    },
    /**
     * 下载代码
     **/
    downloadCode() {
      if (!this.search.dbName) return;
      this.formData.dbName = this.search.dbName;
      // 单表下载
      if (this.showPreviewButton) {
        this.formData.tableName = this.row.tableName;
        downloadCode(this.formData).then(res => {
          this.$utils.downloadFile(res);
        });
      } else {
        // 批量下载
        batchDownloadCode(this.formData).then(res => {
          this.$utils.downloadFile(res);
        });
      }
    },
    /**
     * tab 排序
     * @param codeArray
     * @returns {[]}
     */
    codeSort(codeArray) {
      const sortArray = ["Entity.java", "Dao.java", "Mapper.xml", "IService.java", "ServiceImpl.java", "Controller.java", "avue/api.js", "avue/index.vue"],
        result = [];
      for (let i = 0; i < 8; i++) {
        const codeArrayElement = sortArray[0];
        for (const item of codeArray) {
          if (item.k === codeArrayElement) {
            result.push(item);
          }
        }
        sortArray.shift();
      }
      return result;
    }
  },
  created() {
    // 绑定数据源
    getDbNameList().then(res => {
      const dicData = [];
      res.data.forEach(item => {
        dicData.push({ label: item, value: item });
      });
      this.option.column[0].dicData = dicData;
      this.query();
    });
  },
  mounted() {
    this.$utils.resetHeight(0, this.option);

  },
};
</script>

<style scoped>

</style>
