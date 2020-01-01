<template>
  <view class="page page-profile">
    个人中心
  </view>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  components: {},
  data() {
    return {}
  },
  onLoad() {
    this.refresh();
  },
  onShow() {
    // 监听返回刷新
    this.onMessage();
  },
  methods: {
    refresh() {
      // this.$store.dispatch('getProfile');
    },
    goNext(type, id) { // 跳转方法
      switch(type) {
        // 登录
        case 'login':
          !this.logged && this.$forward('login');
          break;
        // 订单列表
        case 'order':
          this.$forward('order-list', { type: id });
          break;
        // 订单详情
        case 'order-detail':
          this.$forward('order-detail', { order_id: id });
          break;
        // 券
        case 'coupon':
          this.$forward('coupon', { type: 'profile' });
          break;
        // 我的收藏
        case 'favorite':
          this.$forward('favorite-list');
          break;
        // 客服
        case 'service':
          uni.makePhoneCall({
            phoneNumber: '4008766755'
          });
          break;
        // 联系我们
        case 'contact':
          this.$forward('contact');
          break;
        // 设置
        case 'setting':
          this.$forward('setting');
          break;
        default:
          // do nothing...
      }
    }
  }
}
</script>

<style lang="scss">
.page-profile {

}
</style>
