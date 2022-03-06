import { getStore, removeStore, setStore } from "@/util/store";
import website from "@/config/website";


export default {

  state: {
    isCollapse: false,
    isFullScren: false,
    isMenu: true,
    isRefresh: true,
    screen: -1,
    isMobile: false,
    isLock: getStore({ name: "isLock" }),
    colorName: getStore({ name: "colorName" }) || "#409EFF",
    themeName: getStore({ name: "themeName" }) || "default",
    lockPasswd: getStore({ name: "lockPasswd" }) || "",
    website: website
  },
  mutations: {
    SET_DEVICE(state, isMobile) {
      state.isMobile = isMobile;
    },
    SET_ONLY_PAGE: (state, status) => {
      state.website.setting.onlyPage = status;
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      setStore({
        name: "language",
        content: state.language
      });
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    SET_IS_MENU: (state, menu) => {
      state.isMenu = menu;
    },
    SET_IS_REFRESH: (state, refresh) => {
      state.isRefresh = refresh;
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren;
    },
    SET_LOCK: (state) => {
      state.isLock = true;
      setStore({
        name: "isLock",
        content: state.isLock,
        type: "session"
      });
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen;
    },
    SET_COLOR_NAME: (state, colorName) => {
      state.colorName = colorName;
      setStore({
        name: "colorName",
        content: state.colorName,
      });
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName;
      setStore({
        name: "themeName",
        content: state.themeName,
      });
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      setStore({
        name: "lockPasswd",
        content: state.lockPasswd,
        type: "session"
      });
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false;
      state.lockPasswd = "";
      removeStore({
        name: "lockPasswd",
        type: "session"
      });
      removeStore({
        name: "isLock",
        type: "session"
      });
    },
  }
};
