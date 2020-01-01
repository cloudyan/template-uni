export function noop() {}

export function urlfix(url, paramsUrl = '') {
  let fixUrl = url;
  if (paramsUrl) {
    fixUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + paramsUrl;
  }
  return fixUrl;
}

const regMobile = /^(1[3-9][0-9])\d{8}$/; // 缓存正则变量，可以优化性能
export function isMobile(mobile) {  // 手机号正则检测
  return regMobile.test(mobile);
}

// 从html字符串中匹配<img>标签，再匹配src属性
export function regImgs(html = '', isGlobal) {
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  const imgReg = new RegExp('<img.*?(?:>|\/>)', (isGlobal ? 'ig' : 'i') );
  // 匹配src属性
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  const arr = html.match(imgReg);
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const src = arr[i].match(srcReg);
    // 获取图片地址
    if (src[1]) {
      result.push(src[1]);
      // alert('已匹配的图片地址'+(i+1)+'：'+src[1]);
    }
  }

  return result;
}

export const randomString =
  '_~getRandomVcryp0123456789bfhijklqsuvwxzABCDEFGHIJKLMNOPQSTUWXYZ';

export function random(size) {
  const result = [];
  while (0 < size--) {
    result.push(Math.floor(Math.random() * 256));
  }
  return result;
}

export function uuid(size = 21) {
  const url = randomString;
  let id = '';
  let bytes = [];
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    bytes = crypto.getRandomValues(new Uint8Array(size));
    // console.warn(':::uuid crypto:', bytes.join(','));
  } else {
    bytes = random(size);
    // console.warn(':::uuid random:', bytes.join(','));
  }
  while (0 < size--) {
    id += url[bytes[size] & 63];
  }
  return id;
}

export function randomBy(under, over) {
  switch(arguments.length) {
    case 1: return parseInt(Math.random()*under+1);
    case 2: return parseInt(Math.random()*(over-under+1) + under);
    default: return 0;
  }
}

/**
 * 处理价格，默认是元，分第二个参数传100
 * dealPrice(5) => 5.00；dealPrice(500, 100) => 5.00；
 */
export function dealPrice(x, d = 0) {
  let f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  if (f == 0) {
    return f;
  }
  d = d ? d * 100 : 100;
  f = Math.round(f * 100) / d;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

/**
 * 处理距离，显示简写模式,
 * 小于1km,显示"xxm";大于1km简写"xxkm";大于100km全显示">100km"
 */
export function dealDistance(x) {
  let s = '';
  const f = x || 0;
  if (f < 1000) {
    s = f + 'm';
  } else if (f >= 1000) {
    if (f >= 1000 * 100) {
      s = '>100km';
    } else {
      s = (f / 1000).toFixed(1) + 'km';
    }
  }
  return s;
}

/**
 *新版本返回true
 * @param {*} oldVersion 被比较的老版本，默认为1.0.0
 * @param {*} newVersion 新版本号
 */
export function versionCompare(newVersion, oldVersion = '1.0.0') {
  const newVersionArr = newVersion.split('.');
  const oldVersionArr = oldVersion.split('.');
  for (let i = 0; i < newVersionArr.length; i++) {
    let newV = newVersionArr[i] ? +newVersionArr[i] : 0;
    let oldV = oldVersionArr[i] ? +oldVersionArr[i] : 0;
    if (newV > oldV) {
      return true;
    } else if (newV < oldV) {
      return false;
    }
  }
  return false;
}

/**
 * 数组去重
 *
 * @export
 * @param {*} tempArray
 * @param {*} key
 * @returns
 */
export function arrayToHeavy(tempArray = [], key) {
  if (key) {
    const obj = {};
    const newArray = tempArray.reduce((cur, next) => {
      if (next && !obj[next[key]]) {
        obj[next[key]] = true && cur.push(next);
      }
      return cur;
    }, []);
    return newArray;
  } else {
    return [...new Set(tempArray)];
  }
}

// 截流
export function throttle(func, wait, options) {
  /* eslint no-multi-assign: 0 */
  let context;
  let args;
  let result;
  let timeout = null;
  let previous = 0;

  if (!options) options = {};
  const later = () => {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };

  return (...rest) => {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;
    args = rest;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
// 防抖
export function debounce(func, wait, immediate) {
  let timeout;
  let args;
  let context;
  let timestamp;
  let result;

  const later = () => {
    const last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return (...rest) => {
    context = this;
    args = rest;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export function promisify(fn, receiver) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn.apply(receiver, [...args, (err, res) => {
        return err ? reject(err) : resolve(res)
      }])
    })
  }
}

// `delay`毫秒后执行resolve
export function delayTimer(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function deepCopy(obj = '') {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj;
}

export default {
  promisify,
  delayTimer,
  noop,
  urlfix,
  dealPrice,
  dealDistance,
  isMobile,
  regImgs,
  randomBy,
  versionCompare,
  deepCopy
};
