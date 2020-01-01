
export function stringify(params = {}) {
  const temp = params;
  const arr = [];
  for (const key in params) {
    if (!temp[key]) {
      delete temp[key];
    } else {
      arr.push(`${key}=${temp[key]}`);
    }
  }
  return arr.join('&');
}

export function Trim(str,is_global){
  var result;
  result = str.replace(/(^\s+)|(\s+$)/g,'');
  if(is_global && is_global.toLowerCase()=='g'){
    result = result.replace(/\s/g,'');
  }
  return result;
}

export function getQueryString(url, name) { // 获取URL参数
  if (!url) {
    return null;
  }
  const reg = new RegExp('(^|)' + name + '=([^&]*)');
  const r = url.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export function queryString(query) { // 将string解析成Object，无decode!
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;
  for (;
    part = parser.exec(query);
    result[part[1]] = part[2]
  );
  return result;
}

export function replaceSPM(url, spm) {
  if (!url) {
    return null;
  }
  const reg = new RegExp('(^|)spm=([^&]*)');
  const r = url.match(reg);
  if (r != null) {
    let old = unescape(r[0])
    if (old) {
      return url.replace(old, 'spm=' + spm);
    }
  }
  if (url.indexOf('spm=') < 0) {
    if (url.indexOf('?') > 0) {
      url += url + '&spm=' + spm;
    } else {
      url += url + '?spm=' + spm;
    }
  }
  return url;
}

// 字符串截取
export function addPoint (value, length) {
  if (value.length > length) {
    return value.substr(0, length - 1) + '...'
  } else {
    return value
  }
}

const mini = {
  addPoint,
  Trim,
  stringify,
  getQueryString,
  replaceSPM,
  queryString,
};

export default mini;

