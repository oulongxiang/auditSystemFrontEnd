export default (safe) => {
  return {
    tabs: true,
    group: [
      {
        label: "基础信息",
        prop: "basic",
        icon: "el-icon-edit-outline",
        column: [
          {
            label: "项目名称",
            prop: "projectName",
            span: 8,
            maxlength: 100,
            showWordLimit: true,
            rules: [{
              required: true,
              message: "请输入项目名称",
              trigger: "blur"
            }],
          },
          {
            label: "主审人",
            prop: "auditUserId",
            type: "select",
            filterable: true,
            rules: [{
              required: true,
              message: "请选择主审人",
              trigger: "blur"
            }],
            dicData: [],
            span: 8,
          },
          {
            label: "审计对象",
            type: "select",
            prop: "targetList",
            filterable: true,
            formslot: true,
            rules: [{
              required: true,
              message: "请选择审计对象",
              trigger: "blur"
            }],
            span: 8,
          },
          {
            label: "项目成员",
            type: "select",
            multiple: true,
            prop: "projectMemberList",
            filterable: true,
            dicData: [],
            span: 8,
          },
          {
            label: "项目种类",
            type: "select",
            prop: "projectType",
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: safe.$request.getDictList("project_type"),
            filterable: true,
            rules: [{
              required: true,
              message: "请选择项目种类",
              trigger: "blur"
            }],
            span: 8,
          },
          {
            label: "项目归属",
            type: "select",
            prop: "projectAffiliation",
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: safe.$request.getDictList("project_affiliation"),
            filterable: true,
            rules: [{
              required: true,
              message: "请选择项目归属",
              trigger: "blur"
            }],
            span: 8,
          },
          {
            label: "项目协助",
            type: "select",
            prop: "projectCooperation",
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: safe.$request.getDictList("project_cooperation"),
            filterable: true,
            rules: [{
              required: true,
              message: "请选择项目协助",
              trigger: "blur"
            }],
            span: 8,
          },
          {
            label: "项目密级",
            type: "select",
            prop: "projectSecret",
            props: {
              label: "value",
              value: "code"
            },
            dicUrl: safe.$request.getDictList("project_secret"),
            filterable: true,
            rules: [{
              required: true,
              message: "请选择项目密级",
              trigger: "blur"
            }],
            span: 8,
          },
          {
            label: "借阅人员",
            type: "select",
            prop: "borrowUserList",
            filterable: true,
            multiple: true,
            dicData: [],
            span: 8,
          },
        ]
      },
      {
        label: "方案信息",
        prop: "scheme",
        icon: "el-icon-notebook-2",
        column: [
          {
            label: "审计线索",
            prop: "auditClue",
            type: "textarea",
            minRows: 3,
            maxRows: 3,
            maxlength: 500,
            showWordLimit: true,
            span: 8,
          },
          {
            label: "审计目的",
            prop: "auditGoal",
            type: "textarea",
            minRows: 3,
            maxRows: 3,
            maxlength: 500,
            showWordLimit: true,
            span: 8,
          },
          {
            label: "审计范围",
            prop: "auditScope",
            type: "textarea",
            minRows: 3,
            maxRows: 3,
            maxlength: 500,
            showWordLimit: true,
            span: 8,
          },
          {
            label: "审计方法",
            prop: "auditWay",
            type: "textarea",
            minRows: 3,
            maxRows: 3,
            maxlength: 500,
            showWordLimit: true,
            span: 8,
          },
          {
            label: "审计时间",
            prop: "auditDate",
            type: "datetimerange",
            span: 8,
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
          {
            label: "附件",
            prop: "uploadFileList",
            formslot: true,
            span: 8,
          },
          {
            label: "备注",
            prop: "remark",
            type: "textarea",
            formslot: true,
            minRows: 3,
            maxRows: 3,
            span: 16,
          },
        ]
      },
      {
        label: "权限设置",
        prop: "authority",
        icon: "el-icon-s-custom",
        column: [
          {
            label: "权限模式",
            prop: "mode",
            formslot: true,
            minRows: 3,
            maxRows: 3,
            span: 24,
          },

        ]
      }
    ],
  };
};
