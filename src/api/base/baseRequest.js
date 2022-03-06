import { baseUrl } from "@/config/env";
// 数据字典获取URL
export const getDictList = (type, order) => {
  if (order === undefined) {
    order = true;
  }
  return baseUrl + `/dict/getDictListToType?type=${type}&order=${order}`;
};
