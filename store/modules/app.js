import api from '@/api/index'
import { deepCopy } from '@/utils/index'
import storage from '@/utils/storage'
import mini from '@/utils/mini'

const appCache = storage.get('appCache') || {};
const closeCollectionTip = storage.get('closeCollectionTip') || false;

const app = {
  state: {
    floatIcon: appCache.floatIcon || {}, // 首页悬浮icon
    systemInfo: appCache.systemInfo || {}, // 系统信息
    netInfo: appCache.netInfo || {},       // 网络信息
    sceneData: appCache.sceneData || 1001,
    closeCollectionTip, // 首页收藏提示,关闭后一年不显示
  },

  getters: {
    windowWidth: state => {
      return state.systemInfo.windowWidth;
    }
  },

  mutations: {
    SET_FLOAT_ICON(state, payload = {}) {
      state.floatIcon = payload;
    },
    SET_SYSTEMINFO(state, payload = {}) { // 系统信息
      state.systemInfo = payload
    },
    SET_NETINFO(state, payload = {}) { // 网络信息
      state.netInfo = payload
    },
    SET_SCENEDATA(state, payload) { // 场景值
      state.sceneData = payload
    },
    CLOSE_COLLECTION_TIP(state, payload) { // 首页收藏提示
      storage.set('closeCollectionTip', true, 31536000);
      state.closeCollectionTip = true
    },
  },

  actions: {
    initAppConfig({ dispatch, commit, state }, payload = {}) {

    },
    cancelOrder({ dispatch, commit, state }, id) { // 取消订单

    },
    setSystemData({ dispatch, commit, state }, payload = {}) {

    },
    setSystemCache({ commit, state }, payload = {}) { // 设置缓存
      const appCache = deepCopy(state) || {};
      storage.set('appCache', appCache);
    }
  }
}

export default app;
