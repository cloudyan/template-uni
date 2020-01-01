let data = null;

function pagesMap(pageArr) {
  return pageArr.reduce((obj, item) => {
    const page = item.split('/').reverse()[0] || '';
    /* eslint no-param-reassign: 0 */
    obj[page] = `${item}`;
    return obj;
  }, {});
}

function pagesObj(allPages, tabPages) {
  return {
    allPages: pagesMap(allPages),
    tabPages: pagesMap(tabPages),
    defaultPage: allPages[0].split('/').reverse(),
  }
}

const getPages = () => {
  if (data) { // 缓存页面路由
    return data;
  }
  let tabPages,allPages;

  // #ifdef MP-WEIXIN
  const { pages = [], tabBar = {} } = __wxConfig;
  const tabBarList = tabBar.list || [];
  allPages = pages;
  tabPages = tabBarList.map(item => {
    return item.pagePath.replace('.html', '');
  });
  // #endif

  // #ifdef MP-ALIPAY
  const { pagesConfig = {}, tabsConfig = {} } = $global;
  // 测试环境，IDE可以拿到，手机拿不到！发布编译代码没问题-_-!!!
  allPages = Object.keys(pagesConfig);
  tabPages = Object.keys(tabsConfig);
  // #endif

  // #ifdef MP-BAIDU
  const { pages = [], tabBar = {} } = JSON.parse(appConfig);
  const tabBarList = tabBar.list || [];
  allPages = pages;
  tabPages = tabBarList.map(item => => {
    return item.pagePath;
  });
  // #endif

  // #ifdef MP-TOUTIAO
  const { pages = [], tabBar = {} } = __ttConfig;
  const tabBarList = tabBar.list || [];
  allPages = pages;
  tabPages = tabBarList.map(item => => {
    return item.pagePath;
  });
  // #endif

  data = pagesObj(allPages, tabPages);
  return data;
};

/* 为什么不直接运行获取，支付宝$global需加载页面时才能拿到 */

export default getPages;
