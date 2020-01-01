import mini from '@/utils/mini'

function noop() {
  console.log('默认流程');
}

const defaultOptions = {
  method: 'GET',   // 使用的HTTP动词，GET, POST, PUT, DELETE, HEAD
  url: '',         // 请求地址，URL of the request
  header: {
    // 'Accept': 'application/json',
    // 'content-type': 'application/json' // 默认值
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'content-type': 'application/x-www-form-urlencoded',
  },
  dataType: 'json',
  mode: 'cors',           // 请求的模式，主要用于跨域设置，cors, no-cors, same-origin
  timeout: 30000,
  credentials: 'include', // 是否发送Cookie omit, same-origin
  // redirect // 收到重定向请求之后的操作，follow, error, manual
  // integrity // 完整性校验
  // cache: 'default', // 缓存模式(default, reload, no-cache)
};

const reject = noop;

function formatData(data) {
  if (typeof data.status === "number") {
    data.errno = data.status;
  } else {
    data.errno = data.status && data.status.code || '';
    data.errmsg = data.status && data.status.message;
  }
  return data;
}

export default function request(url, options = {}, success = noop, fail = noop) {
  const { hideLoading } = options;
  if (hideLoading) {
    delete options.hideLoading
  }
  const newOptions = Object.assign({}, defaultOptions, options);
  const method = (newOptions.method || 'GET').toUpperCase();
  newOptions.method = method;
  const newData = {};
  for (let key in newOptions.data) {
    if (newOptions.data[key]) {
      newData[key] = newOptions.data[key]
    }
  }
  newOptions.data = newData;
  if (method === 'GET') {
    // newOptions.headers = {
    //   'Content-Type': 'application/json; charset=utf-8',
    // };
    // newOptions.data = JSON.stringify(newOptions.data);
  } else if (method === 'POST') {
    // newOptions.headers = {
    //   // 我们的 post 请求，使用的这个，不是 application/json
    //   'Content-Type': 'application/x-www-form-urlencoded',
    // };
    // newOptions.data = JSON.stringify(newOptions.data);
    // newOptions.data = `${stringify(newOptions.data)}`;
  }

  const resolve = (data) => {
    mini.hideLoading();
    if (typeof success === 'function') {
      success(data);
    }
  };
  const reject = (err = {}) => {
    mini.hideLoading();
    if (typeof fail === 'function' && fail(err)) {
      return;
    }
    const {
      errmsg = '网络异常，请稍后重试',
      errno = 'err',
    } = err;
    if (errno == 20002) {
      mini.forward('login');
    } else if (errno == 10001) {
      // 无相关关联数据,之前是算作成功处理,现不处理
    } else {
      const message = `${errmsg}`;
      mini.showToast(message);
      console.log('errmsg:', message);
    }
  };

  console.log('请求参数：'+ JSON.stringify(newOptions))
  !hideLoading && mini.showLoading();
  console.time(url);
  uni.request(Object.assign({}, newOptions, {
    url, // 目标服务器 url
    success: (res = {}) => {
      // uni.alert({
      //   content: `请求 ${url} ${res.statusCode}`,
      // });
      // console.timeEnd(url);
      // console.group('api:');
      // console.log(`请求 ${url} ${res.statusCode}`);
      console.log(res.data);
      // console.groupEnd('api');
      let { statusCode, data = {} } = res;
      if (statusCode >= 200 && statusCode < 300) {
        res.ok = true;
        data = formatData(data);
        if (data.errno === 10000) {
          resolve(data);
        } else {
          console.log('err:', data);
          reject(data);
        }
      } else {
        // 小程序未处理过的错误
        let err = formatData(data);
        console.log('fetch 异常:', res);
        reject(err);
      }
    },
    fail: (err = {}) => {
      // 小程序处理过的错误
      console.log('fail:', err);
      reject({
        errno: err.error,
        errmsg: err.errorMessage || err.errorMsg,
      });
    },
    complete: () => {

    },
  }))
};
