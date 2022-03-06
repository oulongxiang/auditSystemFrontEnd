/*
 * @Author: your name
 * @Date: 2021-08-18 08:37:51
 * @LastEditTime: 2021-08-28 11:09:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \auditSystemFrontEnd\src\config\env.js
 */
// 配置编译环境和线上环境之间的切换

let baseUrl = "";
const iconfontVersion = ["567566_pwc3oottzol"];
const iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
const codeUrl = `${baseUrl}/code`;
const env = process.env;
if (env.NODE_ENV === "development") {
  baseUrl = `http://localhost:8972/AuditSystem/admin`; // 开发环境地址
} else if (env.NODE_ENV === "production") {
  baseUrl = `http://192.168.100.105:8972/AuditSystem/admin`; // 生产环境地址
} else if (env.NODE_ENV === "test") {
  baseUrl = `http://192.168.101.42:8972/AuditSystem/admin`; // 测试环境地址
}

export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
};
