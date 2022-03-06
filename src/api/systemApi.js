import request from "@/router/axios";
import { baseUrl } from "@/config/env";

// 系统设置相关的Api都在这

/* ---------------------------------1.系统菜单相关Api-----------------------------*/

/**
 * 获取左侧菜单树
 */
export const getLeftMenu = () => request({
    url: baseUrl + "/permission/getLeftMenu",
    method: "get"
  }),


  /**
 * 获取所有菜单列表
 * @param menuType 菜单类型
 */
  getMenuList = (menuType) => request({
    url: baseUrl + "/menu/queryMenu",
    params: { menuType: menuType },
    method: "get"
  }),

  /**
 * 添加一个菜单
 * @param data 添加菜单所需信息 详情请看Swagger
 */
  addMenu = (data) => request({
    url: baseUrl + "/menu/addMenu",
    data: data,
    method: "post"
  }),

  /**
 * 删除一个菜单
 * @param id 菜单id
 */
  delMenu = (id) => request({
    url: baseUrl + "/menu/delMenu",
    params: { id: id },
    method: "delete"
  }),

  /**
 * 更新菜单信息
 * @param data 更新菜单所需信息 详情请看Swagger
 */
  updateMenu = (data) => request({
    url: baseUrl + "/menu/updateMenu",
    data: data,
    method: "post"
  }),

  /* ---------------------------------2.系统元素相关Api-----------------------------*/

  /**
 * 获取指定菜单的元素信息列表
 * @param menuId 菜单id
 */
  queryElement = (menuId) => request({
    url: baseUrl + "/menu/queryElement",
    params: { menuId: menuId },
    method: "get"
  }),

  /**
 * 给指定菜单添加一个元素
 * @param data 所需信息 详情请看Swagger
 */
  addMenuElement = (data) => request({
    url: baseUrl + "/menu/addMenuElement",
    data: data,
    method: "post"
  }),

  /**
 * 更新指定菜单的指定元素
 * @param data 所需信息 详情请看Swagger
 */
  updateMenuElement = (data) => request({
    url: baseUrl + "/menu/updateMenuElement",
    data: data,
    method: "post"
  }),

  /**
 * 删除指定元素
 * @param id 元素id
 */
  delMenuElement = (id) => request({
    url: baseUrl + "/menu/delMenuElement",
    params: { id: id },
    method: "delete"
  }),

  /* ---------------------------------3.系统角色相关Api-----------------------------*/

  /**
 * 获取角色列表
 * @param query 查询条件 详情请看Swagger
 */
  getRoleList = (query) => request({
    url: baseUrl + "/role/getRoleList",
    params: query,
    method: "get"
  }),

  /**
 * 获取指定用户的角色列表
 * @param userId 用户id
 */
  getRoleListToUser = (userId) => request({
    url: baseUrl + "/role/getRoleListToUser",
    params: { userId: userId },
    method: "get"
  }),

  /**
 * 获取所有角色列表
 */
  getAllRoleList = () => request({
    url: baseUrl + "/role/getAllRoleList",
    method: "get"
  }),

  /**
 * 添加角色
 * @param role 所需信息 详情请看Swagger
 */
  addRole = (role) => request({
    url: baseUrl + "/role/addRole",
    data: role,
    method: "post"
  }),

  /**
 * 删除角色
 * @param id 角色id
 */
  delRole = (id) => request({
    url: baseUrl + "/role/delRole",
    params: { id: id },
    method: "delete"
  }),

  /**
 * 更新角色信息
 * @param data 所需信息 详情请看Swagger
 */
  updateRole = (data) => request({
    url: baseUrl + "/role/updateRole",
    data: data,
    method: "post"
  }),

  /**
 * 获取指定角色的所有用户
 * @param roleId 角色id
 */
  getUserListToRole = (roleId) => request({
    url: baseUrl + "/role/getUserListToRole",
    params: { roleId: roleId },
    method: "get"
  }),

  /**
 * 添加指定角色给指定用户
 * @param data 所需数据
 */
  addUserToRole = (data) => request({
    url: baseUrl + "/role/addUserToRole",
    data: data,
    method: "post"
  }),

  /**
 * 添加指定角色给指定组织所有用户
 * @param data 所需数据
 */
  addOrgUserListToRole = (data) => request({
    url: baseUrl + "/role/addOrgUserListToRole",
    data: data,
    method: "post"
  }),

  /**
 * 给指定用户移除指定角色
 * @param data 所需数据
 */
  delRoleUser = (data) => request({
    url: baseUrl + "/role/delRoleUser",
    data: data,
    method: "post"
  }),

  /**
 * 给指定角色添加指定菜单权限
 * @param data 所需数据
 */
  addRolePermission = (data) => request({
    url: baseUrl + "/permission/addRolePermission",
    data: data,
    method: "post"
  }),

  /**
 * 获取指定角色的菜单元素权限列表
 * @param roleId 角色id
 */
  getPermissionListToRole = (roleId) => request({
    url: baseUrl + "/permission/getPermissionListToRole",
    params: { roleId: roleId },
    method: "get"
  }),

  /**
 * 更新指定角色的权限信息
 * @param data 所需数据
 */
  updateRolePermission = (data) => request({
    url: baseUrl + "/permission/updateRolePermission",
    data: data,
    method: "post"
  }),

  /**
 * 删除指定角色的权限
 * @param data 所需信息
 */
  delRolePermission = (data) => request({
    url: baseUrl + "/permission/delRolePermission",
    data: data,
    method: "post"
  }),

  /**
 * 获取部门组织用户树
 */
  getOrgUserTree = () => request({
    url: baseUrl + "/user/getOrgUserTree",
    method: "get"
  }),


  sendLogs = (list) => request({
    url: baseUrl + "/user/logout",
    method: "post",
    data: list
  }),


  /**
 * 获取组织机构树
 */
  getOrganizationTree = () => request({
    url: baseUrl + "/user/getOrganizationTree",
    method: "get"
  }),


  /**
 * 获取审计中心的组织
 */
  getAuditLawOrganization = () => request({
    url: baseUrl + "/bind/getAuditLawOrganization",
    method: "get"
  }),


  /**
 * 获取所有有empId的员工树
 */
  getOrgUserEmpIdTree = () => request({
    url: baseUrl + "/user/getOrgUserEmpIdTree",
    method: "get"
  }),

  /* ---------------------------------4.系统字典相关Api-----------------------------*/
  /**
 * 添加或修改数据字典
 * @param data 所需数据
 */
  addOrUpdateDict = (data) => request({
    url: baseUrl + "/dict/addOrUpdateDict",
    data: data,
    method: "post"
  }),

  /**
 * 获取数据字典列表
 * @param query (查询条件+排序+分页)信息
 */
  getDictList = (query) => request({
    url: baseUrl + "/dict/getDictList",
    params: query,
    method: "get"
  }),

  /**
 * 根据类型或枚举名获取数据字典
 * @param type 类型或枚举名
 */
  getDictListToType = (type) => request({
    url: baseUrl + "/dict/getDictListToType",
    params: { type: type, order: false },
    method: "get"
  }),


  /**
 * 删除数据字典
 * @param dictId 字典id
 */
  delDict = (dictId) => request({
    url: baseUrl + "/dict/delDict",
    params: { dictId: dictId },
    method: "delete"
  }),

  /**
 * 获取字典列表
 * @param params
 */
  getDictAdd = (params) => request({
    url: baseUrl + "/bind/getDictAdd",
    params: params,
    method: "get"
  }),

  /**
 * @description: 获取数据字典表头数据
 * @param params
 * @return {*}
 */
  listDictTypeData = (params) => request({
    url: baseUrl + "/dict/listDictType",
    params: params,
    method: "get"
  }),

  /**
 * @description: 新增或者修改数据字典表头数据
 * @param data
 * @return {*}
 */
  addOrUpdateDictType = (data) => request({
    url: baseUrl + "/dict/addOrUpdateDictType",
    data: data,
    method: "post"
  }),

  /**
 * 删除数据字典
 * @param id 字典id
 */
  delDictType = (id) => request({
    url: baseUrl + "/dict/delDictType",
    params: { id: id },
    method: "delete"
  }),


  /* ---------------------------------5.日志相关Api-----------------------------*/


  /**
 * 根据条件获取错误日志信息列表
 * @param query (查询条件+排序+分页)信息
 */
  getSystemLogList = (query) => request({
    url: baseUrl + "/systemLog/getSystemLogList",
    params: query,
    method: "post"
  }),


  /**
 * 根据条件获取操作日志信息列表
 * @param query (查询条件+排序+分页)信息
 */
  getSqlOperationList = (query) => request({
    url: baseUrl + "/systemLog/getSqlOperationList",
    params: query,
    method: "post"
  }),

  /**
 * 根据条件获取操作ApiLog日志信息列表
 * @param query (查询条件+排序+分页)信息
 */
  getApiLogList = (query) => request({
    url: baseUrl + "/systemLog/getApiLogList",
    params: query,
    method: "get"
  }),


  /* ---------------------------------6.系统相关Api-----------------------------*/

  /**
 * 同步OA用户到系统
 */
  synchronization = () => request({
    url: baseUrl + "/manageSystem/synchronization",
    method: "post"
  }),

  /* 测试APi*/

  /**
 * Excel 导出测试
 */
  excelExportTest = () => request({
    url: baseUrl + "/task/excelExportTest",
    responseType: "arraybuffer",
    method: "get"
  }),

  /**
 * 文件下载测试1
 */
  downLoadFileTest = () => request({
    url: baseUrl + "/task/downLoadFileTest",
    responseType: "arraybuffer",
    method: "get"
  }),


  /* ---------------------------------7.岗位相关Api-----------------------------*/

  /**
 * 根据条件获取操岗位信息列表
 * @param query (查询条件+排序+分页)信息
 */
  getPositionList = (query) => request({
    url: baseUrl + "/position/getPositionList",
    params: query,
    method: "get"
  }),

  /**
 * 添加或修改外部岗位
 * @param data 所需数据
 */
  addOrUpdatePosition = (data) => request({
    url: baseUrl + "/position/addOrUpdatePosition",
    data: data,
    method: "post"
  }),


  /**
 * 删除外部岗位信息
 * @param id 岗位id
 */
  delPosition = (id) => request({
    url: baseUrl + "/position/delPosition",
    params: { id: id },
    method: "delete"
  }),

  /* ---------------------------------8.组织机构相关Api-----------------------------*/

  /**
 * 添加或修改外部组织机构信息
 * @param data 所需数据
 */
  addOrgOutOrUpdate = (data) => request({
    url: baseUrl + "/organization/addOrgOutOrUpdate",
    data: data,
    method: "post"
  }),

  /**
 * 获取组织机构信息列表
 * @param query (查询条件+排序+分页)信息
 */
  getOrgOut = (query) => request({
    url: baseUrl + "/organization/getOrgList",
    params: query,
    method: "get"
  }),

  /**
 * 删除组织机构
 * @param id 组织id
 */
  delOrgOut = (id) => request({
    url: baseUrl + "/organization/delOrgOut",
    params: { id: id },
    method: "delete"
  }),

  /**
 * 绑定组织机构选择框
 * @param params
 */
  bindParentIdList = (params) => request({
    url: baseUrl + "/bind/bindParentIdList",
    params: params,
    method: "get"
  }),


  uploadInvoice = (data) => request({
    url: baseUrl + "/invoiceRecords/uploadInvoice",
    headers: {
      "Content-Type": "multipart/form-data,charset=UTF-8"
    },
    data: data,
    method: "post"
  }),

  /**
     *绑定审计部门人员下拉框
     */
  bindAuditDepartmentUser = () => request({
    url: baseUrl + "/bind/bindAuditDepartmentUser",
    method: "get"
  });
