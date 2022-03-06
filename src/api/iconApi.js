import request from "@/router/axios";
import { baseUrl } from "@/config/env";

/**
 * 绑定图图标选择框
 */
export const bindIconSelect = () => request({
  url: baseUrl + "/icon/bindIconSelect",
  method: "get"
});


