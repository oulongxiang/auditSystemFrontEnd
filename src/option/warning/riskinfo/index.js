export default (safe) => {
    return {
        //是否开启多选框
        selection: true,
        searchMenuSpan: 6,
        //多选提示
        tip: false,
        //新增按钮可见性
        addBtn: false,
        columnBtn: true,//列显隐按钮
        searchShowBtn: false,
        addBtnText: '新增风险',//新增按钮文字
        // card:true,//卡片模式
        border: true,//边框
        index: true,//显示表格序号
        indexLabel: '序号',
        editBtn: false,//编辑按钮禁用
        delBtn: false,//删除按钮禁用
        editTitle: "风险处理",//编辑表单的标题
        dialogDrag: true,//对话框可拖拽
        menuWidth: 150,  //行内菜单宽度
        align: 'center',//居中
        RiskInfoVo: {}, //每条风险信息的vo对象
        ruleCode: '',
        selectIdList: [],//保存多选对象Id

        column: [
            {
                //0
                label: '规则编号',
                prop: 'ruleCode',
                sortable: 'custom',
                orderProp: 'rule_code',
                type: "select",
                minWidth: 100,
                slot:true,
                dicData: [],
                searchFilterable: true,//是否可以输入搜索
                // editDisabled: true,//编辑时禁止输入
                // fromslot:true,
                // searchslot: true,
                props: {
                    label: 'label',
                    value: 'value'
                },
                addDisplay: false,
                editDisplay: false,
                rules: [{
                    message: "请输入必填项",
                    trigger: "blur"
                }]
            },
            {
                //1
                order:1,
                label: '风险编号',
                prop: 'riskCode',
                addDisplay:false,
                sortable: 'custom',
                orderProp: 'risk_code',
                minWidth: 120,
                overHidden: true,
                editDisabled: true,//编辑时禁止输入
                searchFilterable: true,
                addDisabled: true,//新增时禁止输入
                editDisplay:false,//编辑时不显示
                rules: [{
                    required: true,
                    message: "请输入必填项",
                    trigger: "blur"
                }]
            },
            {
                //2
                label: '风险状态',
                prop: 'state',
                type: "select",
                searchOrder: 3,
                minWidth: 100,
                fixed: true,
                search: true,
                editDisplay: false,//编辑时隐藏的项
                addDisplay: false,//新增时隐藏的项
                searchValue: 0,
                searchFilterable: true,
                props: {
                    label: 'value',
                    value: 'code'
                },
            },
            {
                //3
                order:2,
                label: '来源组织',
                prop: 'orgId',
                searchslot: true,//表格搜索选项的自定义
                type: 'select',
                searchOrder: 1,
                minWidth: 120,
                search: true,
                dicData: [],
                //自定义表单插槽、搜索栏插槽
                searchFilterable: true,//是否可以输入搜索
                fromslot: true,
                props: {
                    label: 'orgName',
                    value: 'orgId'
                },
                rules: [{
                    required: true,
                    message: "请输入必填项",
                    trigger: "change"
                }]
            },
            {
                //4
                order:4,
                label: '规则类别',
                // prop: 'typeName',
                prop: 'typeId',
                editDisabled: true,//编辑时禁止输入
                editDisplay:false,
                type: 'select',
                //自定义表单插槽、搜索栏插槽
                searchFilterable: true,
                fromslot: true,
                searchslot: true,
                slot: true,
                rules: [{
                    message: "请输入必填项",
                    trigger: "blur"
                }]
            },
            {
              //4
              order:4,
              label: '风险类别',
              // prop: 'typeName',
              prop: 'riskTypeId',
              type: 'select',
              minWidth: 110,
              //自定义表单插槽、搜索栏插槽
              searchFilterable: true,
              placeholder: "如经济风险、技术风险、政治风险、法律风险、人身风险等",
              fromslot: true,
              searchslot: true,
              slot: true,
              dicData: [],
              props: {
                label: 'label',
                value: 'value'
              },
              rules: [{
                  message: "请输入必填项",
                  trigger: "blur"
              }]
            },
            {
                //5
                order:5,
                label: '风险指标',
                prop: 'ruleListId',
                minWidth: 180,
                overHidden: true,
                editDisplay: false,//编辑时隐藏的项
                //自定义表单插槽、搜索栏插槽
                fromslot: true,
                placeholder:"请输入 判断为风险的依据",
                // searchslot: true,

                slot: true,

            },
            {
                //6
                order:6,
                label: '风险等级',
                prop: 'gradeId',
                searchOrder: 4,
                type: 'select',
                minWidth: 80,
                dicData: [],
                props: {
                    label: 'value',
                    value: 'code'
                },
                search: true,
            },
            {
                //7
                order:7,
                label: '风险描述',
                prop: 'ruleDescription',
                minWidth: 360,
                overHidden: true,
                searchPlaceholder: '请输入大致内容',
                searchFilterable: true,
                rules: [{
                    required: true,
                    message: "请输入必填项",
                    trigger: "blur"
                }]
            },
            {
                //8
                order:8,
                label: '作用范围',
                prop: 'orgIds',
                searchOrder: 2,
                editDisabled: true,//编辑时禁止输入
                type: 'select',
                minWidth: 120,
                search: true,
                overHidden: true,
                dicData: [],
                props: {
                    label: 'label',
                    value: 'value'
                },
                rules: [{
                  required: true,
                  message: "请输入必填项",
                  trigger: "change"
                }]
            },
            {
                //9
                order:9,
                label: '责任人',
                prop: 'principalEmpId',
                minWidth: 100,
                editDisabled: true,//编辑时禁止输入
                type: 'select',
                dicData: [],
                placeholder: "请选择 风险作用范围所属版块的负责人",
                props: {
                    label: 'label',
                    value: 'value'
                },
                rules: [{
                    message: "请输入必填项",
                    trigger: "blur"
                }]
            },
            {
                //10
                order:10,
                label: "执行人",
                prop: 'empId',
                type: 'select',
                editDisabled: true,//编辑时禁止输入
                dicData: [],
                placeholder: "请选择 风险作用范围内的审计人员",
                props: {
                    label: 'label',
                    value: 'value'
                },
                rules: [{
                    message: "请输入必填项",
                    trigger: "blur"
                }]
            },
            {
                //12
                label: "录入人",
                prop: 'createEmpId',
                addDisabled: true,//新增时禁止输入
                type: 'select',
                editDisplay: false,//编辑时隐藏的项
                addDisplay: false,
                dicData: [],
                props: {
                    label: 'label',
                    value: 'value'
                },
            },
            {
                //13
                label: "录入时间",
                prop: 'createTime',
                orderProp: 'risk_info.create_time',
                minWidth: 120,
                sortable: 'custom',
                editDisplay: false,//编辑时是不可见
                addDisplay: false,//新增时不可见
                search: false,
                hide:true,
                searchslot: true,
                overHidden: true,
                format: "yyyy-MM-dd HH:mm",
                valueFormat: "yyyy-MM-dd HH:mm",
                type: "date",
            },
            {
                //14
                label: "更新时间",
                prop: 'updateTime',
                orderProp: 'risk_info.update_time',
                minWidth: 120,
                sortable: 'custom',
                editDisplay: false,//编辑时是不可见
                addDisplay: false,//新增时不可见
                overHidden: true,
                format: "yyyy-MM-dd HH:mm",
                valueFormat: "yyyy-MM-dd HH:mm",
                type: "date",
            },
            {
                //14
                order:11,
                label: "风险影响",
                prop: 'riskImpact',
            },
            {
                //15
                order:12,
                label: "可能后果",
                prop: 'implications',
            },
            {
                //16
                order:13,
                label: "风险概率",
                type: 'select',
                prop: 'riskProbability',
                props: {
                  label: 'value',
                  value: 'code'
              },
              dicData: [],
            },
            {
                //17
                order:14,
                hide:true,
                addDisplay:false,
                editDisplay:false,
                label: "风险期望",
                prop: 'riskExpectation',

            },
            {
                //19
                label: "风险策略",
                prop: 'strategyId',
                type: 'select',
                editDisplay: false,//编辑时隐藏的项
                addDisplay: false,//新增时隐藏
                props: {
                  label: 'value',
                  value: 'code'
                },
                dicUrl: safe.$request.getDictList('riskStrategy')
            },
            {
                //20
                label: "应对措施",
                prop: 'solutions',
                editDisplay: false,//编辑时隐藏的项
                addDisplay: false,//新增时隐藏

            },
            {
                //20
                order:15,
                label: "备注",
                prop: 'remark',
                placeholder:"此处会被批量操作时的输入内容覆盖"
            },
            {
                //22
                label: "处理人",
                prop: 'disposeEmpName',
                editDisabled: true,
                type: 'select',
                addDisplay: false,
                editDisplay:false,
                dicData: [],
                props: {
                    label: 'label',
                    value: 'value'
                },
            },
            {
                //23
                label: "处理时间",
                prop: 'disposeTime',
                minWidth: 120,
                sortable: 'custom',
                orderProp: 'dispose_time',
                editDisplay: false,//表单编辑时不可见
                addDisplay: false,//新增时不可见
                overHidden: true,
                format: "yyyy-MM-dd HH:mm",
                valueFormat: "yyyy-MM-dd HH:mm",
                type: "date",
            },
            {
                label: "数据时间",
                prop: 'dateCreateTime',
                minWidth: 120,
                searchSpan:8,
                searchOrder: 5,
                sortable: 'custom',
                orderProp: 'date_create_time',
                editDisplay: false,//表单编辑时不可见
                addDisplay: false,//新增时不可见
                overHidden: true,
                search: true,
                searchslot: true,
                format: "yyyy-MM-dd HH:mm",
                valueFormat: "yyyy-MM-dd HH:mm",
                type: "date",
            },
            // {
            //     order:3,
            //     labelWidth:170,
            //     type: "radio",
            //     button: true,
            //     editDisabled: true,
            //     label: "是否手动输入风险类别",
            //     prop: 'isManualInputType',
            //     props: {
            //         label: 'value',
            //         value: 'code'
            //     },
            //     value: 1,
            //     change(val){
            //         let optionColumn = safe.$utils.getOptionColumn(safe.option,'typeId');
            //         if(val.value===0){
            //             optionColumn.type="select"
            //         }else{
            //             optionColumn.type="input"
            //         }
            //     },
            //     dicUrl: safe.$request.getDictList('general',true),
            //     hide: true
            // }
        ],
    }

}
