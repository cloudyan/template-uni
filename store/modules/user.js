import api from '@/api/index'
import mini from '@/utils/mini'
import storage from '@/utils/storage'
import { deepCopy } from '@/utils/index'

// 取个人信息缓存
const userInfo = storage.get('userInfo') || { token: '', id: '' };

// 设置Api接口参数
function setApiParams(user) {
  setCommonParams({
    token: user.token,
    uid: user.id,
    uuid: user.id,
  });
  setHeaders({
    Cookie: `XXSESSID=${user.token};`
  });
}

setApiParams(userInfo);

const user = {
  state: {
    userInfo: userInfo, // 个人信息, 合并了登录和个人中心\
  },

  getters: {
    logged: state => {
      return state.userInfo && state.userInfo.token;
    }
  },

  mutations: {
    // 设置userInfo
    SET_USERINFO(state, payload = {}) {
      const newUserInfo = { ...state.userInfo, ...payload };
      state.userInfo = newUserInfo;
      // 设置公共参数
      setApiParams(newUserInfo);
      // 设置缓存, 30天
      storage.set('userInfo', deepCopy(newUserInfo), 0);
    },
    // 退出登录,清除userInfo
    CLEAR_USERINFO(state, payload = {}) {
      state.userInfo = {};
      setApiParams({ token: '', id: '' });
      storage.remove('userInfo');
    },
  },

  actions: {
    // 个人中心接口数据. 用户的部分数据在个人中心里
    // 需要在登录成功后调一下 不与个人中心共用,后期优化
    getProfile({ dispatch, commit, state }, payload = {}) {
      api.getMyProfile({
        hideLoading: true,
      }, res => {
        // 是否是美食家,通过是否有commission判断
        commit('SET_USERINFO', { ...res.data });
      }, err => {
        // console.log(err);
        if (err.errno == '20002') {
          commit('CLEAR_USERINFO');
          return true;
        }
      });
    },
    // 登出
    logOut({ dispatch, commit, state }, payload = {}) {
      api.logout({}, res => {
        commit('CLEAR_USERINFO');
        mini.showToast('退出登录成功');
      }, err => {
        console.log(err);
      });
    }
  }
}

export default user;
