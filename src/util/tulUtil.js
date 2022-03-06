import jsonUtil from "@/util/jsonUtil";
import { deepClone } from "@/util/util";

/**
 * 获取欢迎词
 * @returns 当前属于那个时间区域
 */
export const welcomeWords = (name) => {
    const hours = new Date().getHours();
    // 设置默认文字
    let text;
    // 判断当前时间段
    if (hours >= 6 && hours <= 11) {
      text = `早上好！${name} <br><text class="welcome-words">黎明 , 新的一天 , 新的开始！</text> `;
    } else if (hours > 11 && hours <= 13) {
      text = `中午好！${name} <br><text class="welcome-words">吃个丰盛午餐 , 好好休息一下 , 才更有精神展开下午的工作哦！</text>`;
    } else if (hours > 13 && hours <= 16) {
      text = `下午好！${name}<br><text class="welcome-words">繁忙而又充实的下午已经开始了！</text>`;
    } else if (hours > 16 && hours <= 18) {
      text = `傍晚时分!${name} <br><text class="welcome-words">不要忘记与家人团聚在一起,吃一顿美味的晚餐哦</text>`;
    } else if (hours > 18 && hours <= 22) {
      text = "晚上好!" + name;
    } else {
      text = "夜深了!" + name + '  <br><text class="welcome-words">早点睡觉，美梦会陪伴着你! </text>';
    }
    return text;
  },
  /** 格式化日期 */
  formatDate = (date, pattern) => {
    if (!date) return undefined;
    if (typeof (date) === "string") {
      date = new Date(date.replace(/-/g, "/"));
    }
    let str = pattern;
    str = str.replace(/yyyy/g, date.getFullYear());
    str = str.replace(/MM/g, (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1));
    str = str.replace(/M/g, (date.getMonth() + 1));
    str = str.replace(/dd/g, (date.getDate() < 10 ? "0" : "") + date.getDate());
    str = str.replace(/d/g, date.getDate());
    str = str.replace(/HH/g, (date.getHours() < 10 ? "0" : "") + date.getHours());
    str = str.replace(/H/g, date.getHours());
    str = str.replace(/mm/g, (date.getMinutes() < 10 ? "0" : "") + date.getMinutes());
    str = str.replace(/m/g, date.getMinutes());
    str = str.replace(/ss/g, (date.getSeconds() < 10 ? "0" : "") + date.getSeconds());
    str = str.replace(/s/g, date.getSeconds());
    return str;
  },


  /** 日期加减月份并格式化日期 */
  formatDatePlus = (date, plusMonth, pattern) => {
    if (!date) return undefined;
    if (typeof (date) === "string") {
      date = new Date(new Date(date.replace(/-/g, "/")).setMonth(new Date(date.replace(/-/g, "/")).getMonth() + plusMonth));
    } else {
      date = new Date(date.setMonth(date.getMonth() + plusMonth));
    }
    return formatDate(date, pattern);
  },

  /** 计算两个日期天数差 */
  diffDate = function(date) {
    if (!date) return undefined;
    if (!(date instanceof Date)) {
      console.error("日期格式不正确: " + date);
      return undefined;
    }

    const now = new Date();
    return parseInt((date - now) / (24 * 60 * 60 * 1000));
  },

  /**
 * 判断是否移动端
 * @returns {boolean}  true-移动端 false-电脑端
 */
  isMobile = () => {
    const info = navigator.userAgent,
      agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "iPad"];
    for (let i = 0; i < agents.length; i++) {
      if (info.indexOf(agents[i]) >= 0) return true;
    }
    return false;
  },

  /**
 * 动态设置表格高度
 * @param i
 * @param option
 */
  resetHeight = function(i, option) {
    getHeight();
    const search = document.getElementsByClassName("avue-crud__search")[i]
      .clientHeight;
    option.height = getHeight() - search;
  },

  /**
 * 获取高度
 * @returns {number}
 */
  getHeight = function() {
    const windowHeight = document.body.clientHeight,
      header = document.getElementsByClassName("avue-top")[0]
        .clientHeight;
    let avueTags = document.getElementsByClassName("avue-tags")[0]
      .clientHeight;
    if (avueTags === 0) {
      avueTags = 40;
    }
    // eslint-disable-next-line one-var
    let avueCrudTip = document.getElementsByClassName("avue-crud__tip");
    if (avueCrudTip.length !== 0) {
      avueCrudTip = avueCrudTip[0].clientHeight + 16;
    } else {
      avueCrudTip = 0;
    }
    return windowHeight - header - avueTags - avueCrudTip - 185;
  },

  /**
 * 获取通用的排序参数
 * @param defaultValue 默认排序参数
 * @param option 表格配置
 * @returns 通用的排序参数
 */
  getSortParam = (defaultValue, option) => {
    let result = {};
    const columns = option.column;
    for (const column of columns) {
      if (column.prop === defaultValue.prop) {
        if (column.orderProp) {
          defaultValue.prop = column.orderProp;
        }
        break;
      }
    }
    if (defaultValue.order !== null) {
      defaultValue.order === "ascending" ? result.order = true : result.order = false;
      result.sort = defaultValue.prop;
    } else {
      result.sort = result.order = null;
    }
    result = jsonUtil.clearBlankDate(result);
    return result;
  },

  /**
 * 获取通用表格查询参数
 * @param params -查询条件
 * @param page -分页
 * @param sort -排序
 * @returns 通用表格查询参数
 */
  getQueryParam = (params = {}, page = {}, sort = {}) => {
    const param = deepClone(params);
    Object.keys(param).forEach(key => {
      if (param[key] instanceof Array) {
        delete param[key];
      }
    });
    return jsonUtil.mergeJsonObject(jsonUtil.mergeJsonObject({ pageSize: page.pageSize, currentPage: page.currentPage }, sort), param);
  },

  /**
 * 将json对象置空
 * @param value
 */
  setEmpty = (value) => {
    Object.keys(value).forEach(key => { value[key] = ""; });
  },

  /**
 * 判断是否有指定元素权限
 * @param route 当前路由
 * @param code  元素code
 * @returns {boolean} true-有权限 false-无权限
 */
  hasPermission = (route, code) => {
    for (const item of route.meta.permission) {
      if (code === item.code) {
        return true;
      }
    }
    return false;
  },

  /**
 * 下载Excel 文件
 * @param res 接口调用返回值
 */
  downloadExcel = (res) => {
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/vnd.ms-excel;charset=utf-8", })),
      link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", res.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadFile = (res) => {
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/octet-stream;charset=utf-8", })),
      link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", res.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
 * 设置列字典
 * @param option 表格参数
 * @param prop 设置的列
 * @param dicData 设置的字典
 */
  setOptionDict = (option, prop, dicData) => {
    for (const column of option.column) {
      if (column.prop === prop) {
        column.dicData = dicData;
      }
    }
  },

  /**
 * 获取列字典
 * @param option 表格参数
 * @param prop 获取的列
 */
  getOptionColumnDicData = (option, prop) => {
    for (const column of option.column) {
      if (column.prop === prop) {
        return column.dicData;
      }
    }
  },

  /**
 * 获取列
 * @param option 表格参数
 * @param prop 获取的列
 */
  getOptionColumn = (option, prop) => {
    if (option.group) {
      for (const g of option.group) {
        if (g.prop === prop) {
          return g;
        }
        for (const column of g.column) {
          if (column.prop === prop) {
            return column;
          }
        }
      }
    } else {
      for (const column of option.column) {
        if (column.prop === prop) {
          return column;
        }
      }
    }

  },

  /**
 * 用于搜索栏显隐并重新计算并设置表格高度
 * @param safe 页面的this
 * @param option 表格 option
 * @param ref 表格 ref
 * @param diff 高度差异，搜索栏高度
 */
  displayResetHeight = (safe, option, ref, diff) => {
    ref.$refs.headerSearch.searchShow = !ref.$refs.headerSearch.searchShow;
    if (!ref.$refs.headerSearch.searchShow) {
      option.height = getHeight();
      safe.$nextTick(() => {
        ref.$refs.headerSearch.searchShow = false;
      });
    } else {
    // 显示搜索栏
      option.height = getHeight() - diff;
      safe.$nextTick(() => {
        ref.$refs.headerSearch.searchShow = true;
      });
    }

  },

  /**
 * 返回级联最后一级的元素
 * @param cascadeItems 级联元素列表
 * @returns {[]}
 */
  cascadeReturnLastItem = (cascadeItems) => {
    const result = [];
    cascadeItems.forEach(t => {
      debugger;
      result.push(t[t.length - 1]);
    });
    return result;
  },

  /**
 * json对象转 FormData
 * @param jsonData json对象
 * @returns {FormData}
 */
  jsonToFormData = (jsonData) => {
    const result = new FormData();
    Object.keys(jsonData).forEach(key => {
      const item = jsonData[key];
      if (item instanceof Array) {
        for (let i = 0; i < item.length; i++) {
          if (item[i] && item[i].raw) {
            if (item[i].file) {
              if (item[i].id) {
                result.append(`${key}[${i}].id`, item[i].id);
              }
              result.append(`${key}[${i}].file`, item[i].file);
            } else {
              result.append(`${key}[${i}]`, item[i].raw);
            }
          } else {
            if (!isJson(item[i])) {
              result.append(`${key}[${i}]`, item[i]);
            } else {
              Object.keys(item[i]).forEach(itemKey => {
                if (itemKey.indexOf("$") === -1) {
                  result.append(`${key}[${i}].${itemKey}`, item[i][itemKey]);
                }
              });
            }
          }
        }
      } else {
        if (item !== null) {
          result.append(key, item);
        }
      }
    });
    return result;
  },

  /**
 * [isJson 判断是否是json对象]
 * @param  {[object]}  obj [对象]
 * @return {Boolean}
 */
  isJson = (obj) => {
    return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
  },

  /**
 * 上传文件转通用json
 * @param fileOrFileList 上传的文件或文件列表
 * @returns {{file}|[]|{file, id}}
 */
  defaultFileToFile = (fileOrFileList) => {
    if (fileOrFileList instanceof Array) {
      const result = [];
      fileOrFileList.forEach(fileItem => {
        if (fileItem.id) {
          result.push({ id: fileItem.id });
        } else {
          result.push({ file: fileItem.raw });
        }
      });
      return result;
    } else {
      if (fileOrFileList.id) {
        return { id: fileOrFileList.id };
      } else {
        return { file: fileOrFileList.raw };
      }
    }
  };


export default {
  isMobile, welcomeWords, formatDate, diffDate, resetHeight, getSortParam, getQueryParam, setEmpty, hasPermission, downloadExcel, downloadFile, formatDatePlus, setOptionDict,
  getOptionColumnDicData, getOptionColumn, getHeight, displayResetHeight, cascadeReturnLastItem, jsonToFormData, defaultFileToFile
};
