/* 通过Vue.mixin混入所有页面，此mixin方法仅用于页面，不向外暴露 */
import getPages from './pages'
import { stringify, queryString } from '@/utils/stringUtil'

let pageUUID = 1;
const messages = {};
let msgPages = {};

const mixins = {
  onLoad(option) {
    this.onPageInit(option);
  },
  onShareAppMessage(res) { // 默认分享信息
    // console.log('____res____', res);
    let shareData = {};
    if (res.from === 'button') {
      const { id, shareinfo = {} } = res.target.dataset;
      const userInfo = this.$store.state.user.userInfo;
      if (shareinfo.shareTitle) {
        // 取shareinfo信息, 其它的从页面内拿
        shareData = {
          title: shareinfo.shareTitle,
          imageUrl: shareinfo.shareImg,
          path: `pages/index/index?jumplink=${encodeURIComponent('xxx?id=' + id + '&shareId=' + userInfo.id)}&minishare=1`,
        }
      } else {
        shareData = this.getShareInfo();
      }
    } else {
      shareData = this.getShareInfo();
    }
    return shareData;
  },
  methods: {
    onPageInit(query = {}) { // 初始化页面信息
      this.setQuery(query);

      const pagesArr = getCurrentPages() || [];
      msgPages = {};
      pagesArr.forEach((pageItem, index) => {
        const { pageName, pageId, route } = pageItem;
        // 修改支持多个页面
        const msgKey = `${pageName}:${pageId}`;
        if (!msgPages[pageName]) {
          msgPages[pageName] = [msgKey]
        } else {
          msgPages[pageName].push(msgKey);
        }
      });
    },
    setQuery(query = {}) { // 设置pageName、pageQuery等页面参数
      // #ifdef MP-WEIXIN
      if (query.scene) {
        let paramStr = decodeURIComponent(query.scene);
        Object.assign(query, queryString(paramStr))
      }
      // #endif
      const curtPage = this.$getCurPage();
      const { route = '' } = curtPage;
      const pageId = pageUUID++;
      // 给vue页面实例添加属性
      this.pageName = route.split('/').reverse()[0] || '';
      this.pageId = pageId;
      this.pageQuery = query;
      this.pagePath = route;
      // 直接操作页面实例，添加属性
      curtPage.pageName = route.split('/').reverse()[0] || '';
      curtPage.pageId = pageId;
      curtPage.pageQuery = query;
      curtPage.pagePath = route;
    },
    getShareInfo() {
      const shareInfo = this.shareInfo || {};
      const tempQuery = { ...this.pageQuery };
      const { spm, channel_id } = tempQuery

      return shareInfo;
    },
    refresh() {
      // 空方法，避免报错
    },
    postMessage(page, opts = {}) {
      const { allPages } = getPages();
      if (!allPages[page] && !msgPages[page] || page === this.$getPageName() ) {
        console.error(`无法给 ${page} 页面发消息`);
        return;
      }
      const msgKeys = msgPages[page] || [];
      msgKeys.forEach((msgKey, index) => {
        if (!messages[msgKey]) messages[msgKey] = {};
        Object.assign(messages[msgKey], opts);
      });
    },
    onMessage() {
      const { allPages } = getPages();
      const page = this.$getPageName();
      const msgKey = `${page}:${this.pageId}`;
      let message;
      if (allPages[page] || messages[msgKey]) {
        message = messages[msgKey] || {};
        delete messages[msgKey];
        if (message.needRefresh) {
          this.refresh();
        }
      }
      return message || {};
    },
    formidSubmit(e) { // formId上传
      // console.log('____form id_____', e);
      if (!e) return;
      const pageName = this.$getPageName();
      const pageFormId = `formid-${pageName}`;
      const { formId } = e.detail;
      if (!formId || typeof formId === 'number' || formId.indexOf('formId') > -1) {
        console.log('这是IDE，formId是假的');
        return;
      }
      const { id } = this.$store.state.user.userInfo;
      if (!id) return;
      this.$api.submitFormid({
        formId,
        userId: id,
        hideLoading: true,
      }, res => {
        console.log('上传formId success',formId);
      }, err => {
        console.log('上传formId fail');
        return true;
      });
    },
    submitShareUser(type, id) {
      console.log('submitShareUser')
    },
    imageError(err) { // 图片加载失败
      console.log(err);
    },
  }
}

export default mixins;
