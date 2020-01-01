
import urlParse from './url-parse/index';

const { qs } = urlParse;

// url 映射规则
const h5toMiniRules = {
  'index': { target: 'index' },
  'profile': { target: 'profile' },
  'login': { target: 'login' },
};


/**
 * 获取url类型
 * 暂时不支持跳转 schema 链接
 *
 * @param {any} url [schema, h5, mini, other]
 */
const types = {
  miniapp: /^miniapp:\/\//i, // 小程序跳转
  myh5: /(m(\.dev|\.beta)?\.xxx\.com)/i,
  h5: /^(https|http):\/\//i,
  topicType: /(topic(\.dev|\.beta)?\.doweidu\.com)/i, //活动专题
    // 手机号，h5用a标签写，不走事件，小程序走事件
  tel: /^tel:/i,
    // 领优惠券
  script: /^javascript\:([\w|\d]*)\(\'(.*?)\'\)/,
};

export function getUrlType(url) {
  if (types['miniapp'].test(url)) return 'miniapp';
  if (types['h5'].test(url)) return 'h5';  // 暂时笼统判断都是 http
  if (types['tel'].test(url)) return 'tel';
  if (types['script'].test(url)) return 'script';
  return 'other';
}

function queryMap(params = {}, target = {}) {
  for (let key in params) {
    if (target[key]) {
      params[target[key]] = params[key];
      delete params[key];
    }
  }
  // 暂时不要 ref，这个需要两次 encode，否则其中的?会打断参数
  delete params.ref;
  return params;
}

function getMiniUrl(url = '') {

  // 获取小程序url，直接拼好参数
  const urlType = getUrlType(url);
  const localUrl = urlParse(url);
  let {
    host = '',
    hash = '',
    pathname = '/',
    query = '',
  } = localUrl;

  pathname = pathname.substr(1);
  // 兼容 query 前的 hash
  const tempHash = hash.split('?');
  hash = tempHash[0].replace('#', '');
  const tempQuery = tempHash[1] || '';
  // console.log(query);
  query = Object.assign({}, qs.parse(tempQuery), qs.parse(query));
  let path;
  let pageMap = {};
  let target;
  switch (urlType) {
    case 'myh5':
      path = pathname || 'index';
      pageMap = h5toMiniRules[path] || {};
      query = queryMap(query, pageMap.params)
      break;
    case 'h5':
      path = hash || 'index';
      pageMap = h5toMiniRules[path] || {};
      query = queryMap(query, pageMap.params)
      break;
    default:
      // do nothing...
      pageMap = {
        target: `${pathname}` || '' // comment-list
      };
      query = queryMap(query)
  }
  return {
    query,
    page: pageMap.target,
  };
}

export default getMiniUrl;
