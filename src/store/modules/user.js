import { removeToken, setToken } from "@/util/auth";
import { getStore, setStore } from "@/util/store";
import { isURL, validatenull } from "@/util/validate";
import { deepClone, encryption } from "@/util/util";
import webiste from "@/config/website";
import { loginBySSo, loginByUsername, logout } from "@/api/loginApi";
import { getLeftMenu } from "@/api/systemApi";

function addPath (ele, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'label',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path].replace(/&/g, "$")
  }
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children] && ele[propsDefault.children].forEach(child => {
      if (!isURL(child[propsDefault.path])) {
        child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path] ? child[propsDefault.path] : 'index'}`
      }
      addPath(child);
    })
  }

}
const user = {
  state: {
    userInfo:  getStore({ name: 'userInfo' }) ||{},
    menuId: {},
    menu: getStore({ name: 'menu' }) || [],
    menuAll: getStore({ name: 'menuAll' }) || [],
    token: getStore({ name: 'token' }) || '',
  },
  actions: {
    //根据用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const user = encryption({
        data: userInfo,
        type: 'MD5',
        key: '',
        param: ['useranme', 'password']
      });
      return new Promise((resolve,reject) => {
        loginByUsername(user.username, user.password).then(res => {
          commit('SET_TOKEN', res.data.token);
          commit('SET_USERIFNO', res.data.userInfo);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        }).catch(()=>{
          reject()
        })
      })
    },
    //sso单点登录
    LoginBySso({ commit }, ssoVo) {
      removeToken()
      return new Promise((resolve,reject) => {
        loginBySSo(ssoVo.ticket, ssoVo.service).then(res => {
            commit('SET_TOKEN', res.data.token);
            commit('SET_USERIFNO', res.data.userInfo);
            commit('DEL_ALL_TAG');
            commit('CLEAR_LOCK');
            resolve(res);
        }).catch(()=>{
            reject()
        })
      })
    },
    // 登出
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_MENUALL_NULL', []);
          commit('SET_MENU', [])
          commit('SET_TAG_LIST', [])
          commit('SET_USERIFNO', [])
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //注销session
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_MENUALL_NULL', []);
        commit('SET_MENU', [])
        commit('SET_TAG_LIST', [])
        commit('SET_USERIFNO', [])
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken()
        resolve()
      })
    },
    //获取系统菜单
    GetMenu ({ commit }, parentId) {
      return new Promise(resolve => {
        getLeftMenu(parentId).then((res) => {
          const data = res.data
          let menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele, true);
          })
          commit('SET_MENUALL_NULL', []);
          commit('SET_MENUALL', menu)
          commit('SET_MENU', menu)
          resolve(menu)
        })
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token)
      state.token = token;
      setStore({ name: 'token', content: state.token })
    },
    SET_MENUID (state, menuId) {
      state.menuId = menuId;
    },
    SET_USERIFNO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({ name: 'userInfo', content: state.userInfo })
    },
    SET_MENUALL: (state, menuAll) => {
      let menu = state.menuAll;
      menuAll.forEach(ele => {
        if (!menu.find(item => item.label === ele.label && item.path === ele.path)) {
          menu.push(ele);
        }
      })
      state.menuAll = menu
      setStore({ name: 'menuAll', content: state.menuAll })
    },
    SET_MENUALL_NULL: (state) => {
      state.menuAll = []
      setStore({ name: 'menuAll', content: state.menuAll })
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({ name: 'menu', content: state.menu })
    },

  }
}
export default user
