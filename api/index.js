import env from '@/config/env';
import config from '@/config/index';
import _request from './request';
import { stringify } from '@/utils/stringUtil';
import mini from '@/utils/mini';

const regHttp = /^https?/i;

function request(url, options, success, fail) {
  const originUrl = regHttp.test(url) ? url : `${env.apiBaseUrl}${url}`;
  return _request(originUrl, options, success, fail);
}

function buildUrl(matchUrl, params) {
  // if(status == 'path') return matchUrl.replace(/[{}]/g, '').toLocaleLowerCase();
  matchUrl = matchUrl.replace(/\{([\w\d_]+)\}/g, function (match, $1) {
    var val = params[$1];
    if (!val) {
      throw '[ERROR] [AJAX] ajax param "' + $1 + '" is not defined.';
    }
    // if (matchUrl.match(/^http[s]?\:\/\//g)) {
    //   delete params[$1];  // 这里别删除了，滚动加载删了就没了(item/{item}格式参数)
    // }
    return val;
  });
  return matchUrl;
}
/**
 * API 命名规则
 * - 使用 camelCase 命名格式（小驼峰命名）
 * - 命名尽量对应 RESTful 风格，`${动作}${资源}`
 * - 假数据增加 fake 前缀
 * - 便捷易用大于规则，程序是给人看的
 */

const modelApis = {
  login: 'POST /api/user/login',
  getProfile: '/api/user/info',
  config: '/api/common/config',
};

const commonParams = {
  terminal: '',
  version: '1.0.0', // 系统版本，用于获取最新版数据
  channel: 'iqwxpp',    // 渠道
  // uuid: '',    // 用户唯一标志
  // device: '', // 设备
  // timestamp: '',    // 时间
  // token: '', // 用户登录时必传
};

const headers = {
  'Accept': 'application/json',
  'content-type': 'application/x-www-form-urlencoded',
};

// console.log(Object.keys(modelApis))

const models = Object.keys(modelApis).reduce((api, key) => {
  /* eslint no-param-reassign: 0 */
  const val = modelApis[key];
  const [url, method = 'GET'] = val.split(/\s+/).reverse();
  // method = method.toUpperCase();
  // let originUrl = regHttp.test(url) ? url : `${env.apiBaseUrl}${url}`;
  api[key] = (params, success, fail) => {
    const { hideLoading } = params;
    delete params.hideLoading;
    const newUrl = buildUrl(url, params);
    return request(newUrl, {
      method,
      hideLoading,
      header: getHeaders(),
      data: Object.assign({}, getCommonParams(), mini.getChannel(), params),
    }, success, fail);
  };
  return api;
}, {});

export function setCommonParams(params) {
  return Object.assign(commonParams, params);
}

export function getCommonParams() {
  return { ...commonParams };
}

export function setHeaders(params) {
  return Object.assign(headers, params);
}

export function getHeaders() {
  return { ...headers };
}

models.getCommonParams = getCommonParams;
models.setCommonParams = setCommonParams;
models.getHeaders = getHeaders;
models.setHeaders = setHeaders;

export default models;
