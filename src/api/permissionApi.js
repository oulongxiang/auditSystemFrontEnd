import request from "@/router/axios";
import { baseUrl } from "@/config/env";

/**
 * 绑定用户可查看的组织树
 */
export const bindVisibleOrgTree = () => request({
    url: baseUrl + '/bind/bindVisibleOrgTree',
    method: 'get'
})
