import request from "@/router/axios";
import { baseUrl } from "@/config/env";

/**
 * 获取代表工龄报表数据列表
 */
export const getSenioritySalesList = (ruleInfoId) => request({
  url: baseUrl + "/riskInfo/getSenioritySalesList",
  params: { ruleInfoId: ruleInfoId },
  method: "get"
});
