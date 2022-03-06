/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from "axios";
import store from "@/store/";
import router from "@/router/router";
import { serialize } from "@/util/util";
import { getToken } from "@/util/auth";
import { Message } from "element-ui";
import website from "@/config/website";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css";


axios.defaults.timeout = 100000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  if (getToken() && !isToken) {
    config.headers[website.Authorization] = getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(res => {
  NProgress.done();
  const status = Number(res.status);
  // 正常请求
  if (status === 200) {
    let code
    let isDownloadFile= res.data instanceof ArrayBuffer
    if(isDownloadFile){
      const contentType=res.headers['content-type']
      if(contentType==='application/vnd.ms-excel;charset=UTF-8' || contentType==='application/octet-stream;charset=UTF-8'){
        return {data:res.data,fileName:decodeURI(res.headers['filename'])};
      }
      //如果是文件下载时，返回的数据是json格式，则说明服务端报错
      if(contentType==='application/json;charset=UTF-8' || contentType==='application/json'){
        let enc = new TextDecoder('utf-8')
        let errorResult = JSON.parse(enc.decode(new Uint8Array(res.data)))
        code=errorResult.code
        res.data.message=errorResult.message
      }
    }else{
      code = res.data.code;
    }
    switch (code) {
      case "200":
        return res.data;
      case "401": // 账号在其他地方登录 或者 长时间未进行操作
        fail(res.data.message);
        store.dispatch('FedLogOut').then(() => router.push({path: '/login'}));
        break;
      case "403": // 无权
        fail(res.data.message);
        setTimeout(() => {
          router.push({path: '/403'});
        }, 1000);
        break;
      case "404":
        fail("请求不存在");
        break;
      case "405":
        fail("系统正在维护中");
        store.dispatch('FedLogOut').then(() => router.push({path: '/405'}));
        break;
      case "500":
      case "8005":
      default:
        fail(res.data.message);
        break;
    }

  } else if (status === 404) {
    fail("请求不存在");
  } else {
    // 非正常请求
    fail(res.data.message);
  }

  return Promise.reject(new Error(res.data.message));
}, error => {
  NProgress.done();
  if (error && error.message.indexOf("Network Error") !== -1) {
    fail("网络错误，请检查网络");
  } else {
    fail(error);
  }
  return Promise.reject(new Error(error));
});

const fail = message => {
  Message({
    message: message,
    type: 'error'
  })
}

export default axios;
