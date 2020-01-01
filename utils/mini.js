import config from '@/config/index'
import getPages from './pages'
import urlMap, { getUrlType } from './urlMap'
import { stringify, Trim } from './stringUtil'
import { isFastClick } from './is'

const channelConfig = {
  spm: config.channel,
  channel: config.channel,
}

const channelUpdate = {
  spm: config.channel,
  channel: config.channel,
}

const mini = {
  showToast(opt) { // 改写showToast
    const opts = {
      icon: 'none',
      duration: 2500,
    };
    if (typeof opt === 'string') {
      opts.title = opt
    } else {
      Object.assign(opts, opt)
    }
    uni.showToast(opts);
  },
  hideToast() {
    uni.hideToast();
  },
  showLoading(opt) {
    uni.showLoading(opt);
  },
  hideLoading() {
    uni.hideLoading();
  },
  showConfirm(opt) {
    uni.showModal(opt);
  },
  showActionSheet(opt) {
    uni.showActionSheet(opt);
  },
  getCurPage() { // 当前页面实例
    const pages = getCurrentPages();
    return pages[pages.length - 1] || {};
  },
  getPageInfo() {
    const curtPage = mini.getCurPage();
    const { route = '', pageQuery = {} } = curtPage;
    return {
      pageQuery: { ...pageQuery },
      pagePath: route,
      pageName: route.split('/').reverse()[0] || '',
      referer: '',
    }
  },
  getPageName() {
    const { pageName } = mini.getPageInfo();
    return pageName;
  },
  getChannel() { // 获取当前渠道信息
    const { pageQuery = {} } = mini.getCurPage();
    const current = {};
    if (pageQuery.spm) current.spm = pageQuery.spm;
    if (pageQuery.channel_id) current.channel = pageQuery.channel_id;
    return {...channelConfig, ...channelUpdate, ...current }
  },
  updateChannel(opts = {}) { // 将渠道信息更新到channelUpdate上
    if (opts.spm) channelUpdate.spm = opts.spm;
    if (opts.channel_id) channelUpdate.channel = opts.channel_id;
  },
  showErrPage(message = '', replace = true) {
    const pageName = mini.getPageName();
    if (pageName !== 'error') {
      mini.goPage('error', {
        message,
        replace,
      });
    }
  },
  getCurPageUrl(url = '', params = {}) {
    const { allPages } = getPages();
    let query = { ...params };
    let urlArr = url ? url.split('?') : [];
    let pageName = urlArr[0];
    if (!pageName) return;
    let pagePath = allPages[pageName]; // || ''; 这里暂时不要适配空的情况，收藏有礼会失败
    query = !urlArr[1] ? stringify(query) :
    [stringify(query), urlArr[1]].join('&');
    if (!pagePath) {
      if(url == '/') {
        pagePath = '';
      }

    }
    query = query ? `?${query}` : '';
    return {
      pageName,
      query,
      pagePath: `${pagePath}`,
      pageUrl: `${pagePath}${query}`,
    };
  },
  goPage(url, query = {}) {
    if (!url) return;
    const { tabPages } = getPages();
    const { replace, back, appname, appid } = query;
    const params = mini.getChannel();
    query = Object.assign({
      spm: params.spm,
      channel_id: params.channel,
    }, query);

    let page = url;
    let type = '';
    const { pageName, pagePath, pageUrl } = mini.getCurPageUrl(url, query) || {};
    if (appname || appid) {
      type = 'miniapp'
    } else {

      type = replace ? 'replace' : (back ? 'back' : '');

      if (type !== 'miniapp' && !pagePath) return

      page = { url: `/${pageUrl}` };

      if (tabPages[pageName]) {
        type = 'switch';
        page = { url: `/${pagePath}` };
      }
    }

    /* eslint no-param-reassign: 0 */
    delete query.replace;
    delete query.back;
    delete query.appname;

    switch (type) {
      case 'replace':
        // 上传formid事件没办法触发，需要一点时间延迟
        setTimeout(() => {
          uni.redirectTo(page);
        },200)
        break;
      case 'back':
        uni.navigateBack(page);
        break;
      case 'switch':
        // uni.switchTab: url 不支持 queryString
        // 上传formid事件没办法触发，需要一点时间延迟
        setTimeout(() => {
          uni.switchTab(page);
        },200)
        break;
      case 'miniapp': // 跳小程序
        const { appid, miniAppType } = query
        delete query.appid;
        delete query.miniAppType;

        let tempPath = `/${page}`
        const tempQuery = stringify(query)
        if (tempQuery || tempQuery !== '') {
          tempPath += '?' + tempQuery
        }
        // console.log('miniapp:',appid,tempPath,query,miniAppType)
        // 1 // 同主体下小程序
        // 2 // 白名单内小程序

        // if (parseInt(miniAppType) === 1) {
        if(true) {
          const miniUrl = {
            appId: appid, // 跳转到的小程序appId
            // path, // 打开的页面路径，如果为空则打开首页
            extraData: query, // 需要传递给目标小程序的数据
            success: (res) => {
              console.log('navigateToMiniProgram res:',res)
            },
            fail: (err) => {
              console.log('navigateToMiniProgram err:',err)
            },
            complete: (val) => {
              console.log('navigateToMiniProgram complete',val)
            }
          };
          if(!!pagePath) {
            miniUrl.path = tempPath;
          }
          // console.error('miniUrl', JSON.stringify(miniUrl, null, 2))
          uni.navigateToMiniProgram(miniUrl);
        // } else {

        }
        break;
      default:
        /* eslint no-undef: 0 */
        if (getCurrentPages().length === 10) {
          setTimeout(() => {
            uni.redirectTo(page);
          }, 200);
        } else {
          // navigateTo, redirectTo 只能打开非 tabBar 页面。
          // switchTab 只能打开 tabBar 页面。
          uni.navigateTo(page);
        }
        break;
    }
  },
  realGoPage(page, query) { // spm透传
    const { pageQuery = {} } = mini.getCurPage();
    if (!query.spm) query.spm = pageQuery.spm
    if (!query.channel_id) query.channel_id = pageQuery.channel_id
    const pageName = mini.getPageName();
    // 当前路径
    query.refer = 'pages/' + pageName + '/' + pageName;
    // console.log('====page:' + page + ', query:' + JSON.stringify(query));
    mini.goPage(page, query);
  },
  onUrlPage(e) { // url跳转
    if (!isFastClick()) {
      // console.warn('慢着点，别着急')
      return;
    }
    let { url, index, piwikEvent, piwikData, tiptype = '' } = e.currentTarget.dataset;
    url = Trim(url+'');
    if (!url || url == 'undefined' || url == 'null') {
      return;
    }
    const currentPage = mini.getPageName();
    const type = getUrlType(url);
    if (type == 'miniapp') {
      // 暂不处理
    }

    if(type == 'topic') {
      const { pageQuery = {} } = mini.getCurPage();
      if (url.indexOf('spm') < 0 && pageQuery && pageQuery.spm) {
        url = url + (url.includes('?') ? '&' : '?') + 'spm=' + pageQuery.spm;
      }
      if (url.indexOf('channel_id') < 0 && pageQuery && pageQuery.channel_id) {
        url = url + (url.includes('?') ? '&' : '?') + 'channel_id=' + pageQuery.channel_id;
      }
      mini.goPage('topic', {url: encodeURIComponent(url)});
      return;
    }

    const map = urlMap(url);
    // console.log(`jump: ${map.page} <- ${url}`)
    if (!map.page) {
      console.log('暂不支持跳转此页面');
      return;
    }

    if(map.page === currentPage && map.query){
      map.query.replace = true;
      if (map.page == 'index') {
        // console.log('首页跳转首页无需跳转');
        return;
      }
    }

    mini.realGoPage(map.page, map.query);
  },
  forward(page, query = {}) { // 页面+参数跳转
    // if (!isFastClick()) {
    //   // console.warn('慢着点，别着急')
    //   return;
    // }
    if (page === 'login' || query.refresh) {
      Object.assign(query, {
        ref: mini.getPageName(),
        needRefresh: true,
      });
    }
    mini.realGoPage(page, query);
  },
  back(num = 1) {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack({
        delta: num
      });
    } else {
      mini.forward('index');
    }
  },
}

export default mini;
