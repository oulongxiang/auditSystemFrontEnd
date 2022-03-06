import request from "@/router/axios";
import { baseUrl } from "@/config/env";


/**
 * 获取用户信息列表
 * @param params 查询和分页排序参数
 */
export const getUserInfoList = (params) => request({
  url: baseUrl + "/user/getUserInfoList",
  params: params,
  method: "get"
});

/**
 * 获取组织列表(用于绑定组织区域下拉选择框)
 */
export const getOrgList = () => request({
  url: baseUrl + "/bind/bindOrgList",
  method: "get"
});

/**
 * 修改密码
 * @param data 所需数据
 */
export const updatePassword = (data) => request({
  url: baseUrl + "/user/updatePassword",
  data: data,
  method: "post"
});

/**
 * 获取组织机构信息
 */
export const getUserInfoEmpIdList = () => request({
  url: baseUrl + "/user/getUserInfoEmpIdList",
  method: "get"
});


/**
 * 获取岗位信息
 */
export const getPositionNameList = () => request({
  url: baseUrl + "/user/getPositionNameList",
  method: "get"
});

/**
 * 新增外部员工
 * @param data
 * @returns {*}
 */
export const addUserInfoOut = (data) => request({
  url: baseUrl + "/user/addUserInfoOut",
  data: data,
  method: "post"
});


/**
 * 删除组织机构
 * @param dictId 字典id
 */
export const delUserInfoOut = (id) => request({
  url: baseUrl + "/user/delUserInfoOut",
  params: { id: id },
  method: "delete"
});

/**
 * 绑定角色
 */
export const bindRole = () => request({
  url: baseUrl + "/bind/bindRole",
  method: "get"
});

/**
 * 绑定下级用户选择框
 */
export const bindSubordinateUserSelect = () => request({
  url: baseUrl + "/bind/bindSubordinateUserSelect",
  method: "get"
});

/**
 * 获取用户上级ID
 */
export const getUserLeaderId = (id) => request({
  url: baseUrl + "/user/getUserLeaderId",
  params: { userId: id },
  method: "get"
});

/**
 * 获取登录日志
 */
export const getLoginLogList = (params) => request({
  url: baseUrl + "/user/getLoginLogList",
  params: params,
  method: "get"
});

/**
 * 获取操作日志
 */
export const getOperationLogList = (params) => request({
  url: baseUrl + "/systemLog/getOperationLogList",
  params: params,
  method: "get"
});

export default {
  getUserInfoList,
  getOrgList,
  updatePassword,
  getUserInfoEmpIdList,
  getPositionNameList,
  addUserInfoOut,
  delUserInfoOut,
  bindRole,
  bindSubordinateUserSelect,
  getLoginLogList
};
