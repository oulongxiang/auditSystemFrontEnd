import request from "@/router/axios";
import { baseUrl } from "@/config/env";

/**
 * 获取所有数据源名
 */
export const getDbNameList = () => request({
  url: baseUrl + "/gen/getDbNameList",
  method: "get"
});

/**
 * 获取指定数据源的数据表
 */
export const getTableList = (params) => request({
  url: baseUrl + "/gen/getTableList",
  params: params,
  method: "get"
});

/**
 * 获取指定数据表的列信息
 */
export const getColumnList = (dbName, tableName) => request({
  url: baseUrl + "/gen/getColumnList",
  params: { dbName: dbName, tableName: tableName },
  method: "get"
});

/**
 * 预览代码
 */
export const previewCode = (params) => request({
  url: baseUrl + "/gen/previewCode",
  params: params,
  method: "get"
});

/**
 * 下载代码
 */
export const downloadCode = (params) => request({
  url: baseUrl + "/gen/downloadCode",
  params: params,
  method: "get",
  responseType: "arraybuffer",
});

/**
 * 批量下载代码
 */
export const batchDownloadCode = (params) => request({
  url: baseUrl + "/gen/batchDownloadCode",
  params: params,
  method: "get",
  responseType: "arraybuffer",
});


