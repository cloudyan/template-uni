// this.dealList //处理数据函数,外部添加 接收 array
// 默认 listData 数据，当前列表数据
let requestIndex = 0; // 请求位置 防止同时请求返回数据相互覆盖问题

export default {
  data() {
    return {
      // isLoading: true, // 页面是否在load 默认页面在loading
      pullLoading: false, // 翻页load
      finished: false, // 是否到底部 显示提示

      listData: [], // 列表数据

      pullParamsDefault: {
        // 默认参数
        pageNum: 1, // 当前页
        pageLimit: 20, // 没页条数
        needPagination: 1,
        // page_serial: '',
      },
      pullParams: {}, // 参数
    };
  },

  methods: {
    // 初始化参数
    initPullList() {
      this.pullParams.page_serial = ''; // 分页序列号
      this.pullParams.pageNum = 1;
      this.finished = false; // 是否到底
      this.pullLoading = false;
      this.listData = [];
    },
    // 刷新
    onRefresh() {
      this.initPullList();
      window.scrollTo(0, 10);
    },
    // 加载下一页
    onScrollToLower() {
      // console.log('loading...');
      if (this.pullLoading) return; // 翻页是否还在load
      // 已到底部
      if (this.finished) {
        this.pullLoading = false;
        console.log('没有更多数据了');
        return;
      }
      // 显示loading
      this.pullLoading = true;
      // 记录请求 位置
      const qIndex = requestIndex;
      requestIndex++;
      const { pageNum, pageLimit = 20 } = this.pullParams;
      this.pageNum = pageNum; // 对pageNum赋值,供外部函数(dealList)使用
      this.pullModel(
        {
          ...this.pullParamsDefault,
          last_id: (pageNum - 1) * pageLimit,
          limit: pageLimit,
          ...this.pullParams,
          hideLoading: true,
        },
        res => {
          this.$hideLoading();
          this.pullLoading = false;
          // 判断请求返回 位置
          if (requestIndex - 1 > qIndex) {
            return;
          }
          if (typeof this.afterPull === 'function') {
            this.afterPull(res);
          }
          this.dealData(res);
        },
        err => {
          this.$hideLoading();
          this.pullLoading = false;
          console.log(err);
          // 特殊 code 特殊处理
          if (err.errno === 20002) {
            this.$forward('login')
            return true;
          }
        },
        this
      );
    },

    // 统一api
    // 需要外部重写
    pullModel(...rest) {
      // api.getItem.apply(this, rest)
    },
    // 处理数据业务逻辑
    dealData(res = {}) {
      const { pageNum = 1 } = this.pullParams;
      const { data = {} } = res;
      // this.pullParams.page_serial = data.page_serial || ''; // 分页序列号

      let newList = data.list || (Array.isArray(data) ? data : []); // list 数据
      // 后台返回 是否还有下一页
      let hasMore = false;
      if (res.pagination) {
        hasMore = !!res.pagination.has_more;
      } else {
        const totalPage = res.data.totalPage || res.data.total_page || 1;
        hasMore = totalPage > this.pullParams.pageNum;
      }
      // 如果第一页没有数据 默认已经到达最底部
      if (pageNum === 1 && !newList.length) {
        hasMore = false;
      }
      if (pageNum === 1) {
        this.listData = [];
      }
      if (hasMore) {
        this.pullParams.pageNum += 1; // 页数加一
      }
      this.finished = !hasMore;
      // dealList 方法 外部重写
      if (typeof this.dealList === 'function' && newList.length) {
        let temp = this.dealList(newList) || [];
        if (!temp) {
          this.$showToast('处理数据返回格式有问题');
          return;
        }
        /* eslint no-param-reassign: 0 */
        newList = temp.filter(i => i);
      }

      // 数组去重
      this.listData = this.listData.concat(newList);
      // console.log(this.listData)
      // console.log(typeof this.afterPullData)
      if (typeof this.afterPullData === 'function') {
        this.afterPullData(res);
      }
    },
  },
};
