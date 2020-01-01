let allData = {};

try {
  allData = uni.getStorageSync('global') || {};
} catch (e) {
  // error
}

const storage = {
  set(key, value, time = 86400 * 30) { // time单位秒，默认30天，0为1年
    if (!time) time = 60 * 60 * 24 * 365;
    const timeout = Date.now() - 1 + time * 1000;
    // console.log(timeout);
    const data = {
      value,
      timeout,
    };
    Object.assign(allData, {
      [`${key}`]: data,
    });
    uni.setStorage({
      key: 'global',
      data: allData,
      success: function () {
        // console.log('success');
      }
    });
  },
  get(key) {
    if (!key) return;
    const temp = allData[key] || {};
    if (!temp.timeout || !temp.value) return null;
    const now = Date.now();
    if (temp.timeout < now) {
      this.remove(key);
      return '';
    }
    return temp.value;
  },
  remove(key) {
    if (!key) return;
    delete allData[key];
    this.setAllData();
  },
  clear() {
    allData = {};
    this.setAllData();
  },
  setAllData() {
    uni.setStorage({
      key: 'global',
      data: allData,
      success: function () {
        // console.log('success');
      }
    });
  }
}

export default storage;