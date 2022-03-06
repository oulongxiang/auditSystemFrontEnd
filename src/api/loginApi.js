import request from "@/router/axios";
import { baseUrl } from "@/config/env";

// 登录相关的Api都在这

/**
 * 账号密码登录
 * @param accountNumber 登录账号
 * @param loginPassword 登录密码
 */
export const loginByUsername = (accountNumber, loginPassword) => request({
  url: baseUrl + "/user/login",
  method: "post",
  data: {
    accountNumber: accountNumber,
    loginPassword: loginPassword
  }
});

/**
 * 单点登录
 * @param ticket 令牌
 * @param service 服务地址
 */
export const loginBySSo = (ticket, service) => request({
  url: baseUrl + "/user/loginToSso",
  method: "post",
  data: {
    ticket: ticket,
    service: service
  }
});

/**
 * 登出
 */
export const logout = () => request({
  url: baseUrl + "/user/logout",
  method: "post"
});
