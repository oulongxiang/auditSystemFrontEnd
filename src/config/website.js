
/**
 * 全局配置文件
 */
export default {
  title: "审计系统",
  logo: "AUDIT",
  key: 'audit',//配置主键,目前用于存储
  indexTitle: '审计系统',
  lockPage: '/lock',
  Authorization: 'Authorization',
  AuthorizationKey:'AuthorizationAudit',
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [400],
  //配置首页不可关闭
  isFirstPage: false,
  setting: {
    sidebar: 'vertical',
    onlyPage:false,
    tag: true,
    debug: true,
    collapse: true,
    search: true,
    lock: true,
    screenshot: true,
    fullscren: true,
    theme: true,
    menu: true,
    color: true,
  },
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'icon-caidan',
    props: {
      label: 'label',
      path: 'path',
      icon: 'icon',
      children: 'children'
    }
  }
}