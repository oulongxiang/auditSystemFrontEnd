import Vue from "vue";
import axios from "./router/axios";
import VueAxios from "vue-axios";
import App from "./App";
import router from "./router/router";
import "./permission"; // 权限
import "./error"; // 日志
import "./cache"; // 页面缓冲
import store from "./store";
import { loadStyle } from "./util/util";
import "./util/dialog"; // 窗体拖拽
import * as urls from "@/config/env";
import { iconfontUrl, iconfontVersion } from "@/config/env";
import Element from "element-ui";
import "./styles/common.scss";
import basicBlock from "./components/basic-block/main";
import basicContainer from "./components/basic-container/main";
import utils from "@/util/tulUtil";
import jsonUtil from "@/util/jsonUtil";
import "./icon/iconfont.css";
import "../public/cdn/kk/kk-1.3.4.min";

Vue.use(router);
Vue.use(VueAxios, axios);
Vue.use(Element);
Vue.use(window.AVUE);
Vue.use(window.vant.Lazyload);
// 注册全局容器
Vue.component("basicContainer", basicContainer);
Vue.component("basicBlock", basicBlock);
// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
});

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace("$key", ele));
});

Vue.config.productionTip = false;

Vue.prototype.$jsonUtil = jsonUtil;
Vue.prototype.$utils = utils;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
