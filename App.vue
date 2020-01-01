<script>
import mini from '@/utils/mini'
import store from '@/store/index'
import { queryString } from '@/utils/stringUtil'

export default {
  onLaunch: function(opts) {
    // console.log('____onLaunch opts_____', opts);
    const { query, scene } = opts;
    const { extraData } = (opts.referrerInfo || {});

    // #ifdef MP-WEIXIN
    if (query.scene) {
      let paramStr = decodeURIComponent(query.scene);
      Object.assign(query, queryString(paramStr))
    }
    // #endif

    mini.updateChannel(query || extraData);
    store.dispatch('setSystemData', {type: 'SET_SCENEDATA', data: scene});
    uni.getSystemInfo({
      success: function(res) {
        // console.log('getSystemInfo: ', res);
        store.dispatch('setSystemData', {type: 'SET_SYSTEMINFO', data: res});
      },
      fail: function(err) {
        // console.log('getSystemInfo err', err);
      }
    });
    store.dispatch('initAppConfig');
  },
  onShow: function(opts) {
    // console.log('_____onShow opts_____', opts);
    let { query, scene } = opts;
    const { extraData } = (opts.referrerInfo || {});
    if (scene && !query && !extraData) {
      query = {};
    }

    // #ifdef MP-WEIXIN
    if (query.scene) {
      let paramStr = decodeURIComponent(query.scene);
      Object.assign(query, queryString(paramStr))
    }
    // #endif

    if (query.share_code) {
      store.commit('SET_SHARE_CODE', query.share_code);
    }
    mini.updateChannel(query || extraData);
    store.dispatch('setSystemData', {type: 'SET_SCENEDATA', data: scene});
    uni.getNetworkType({
      success: function(res) {
        // console.log('getNetworkType: ', res);
        store.dispatch('setSystemData', {type: 'SET_NETINFO', data: res});
      }
    });
    // store.dispatch('getLocation');
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
@import url("./components/d-parse/d-parse.css");

page,
view,
block,
text,
swiper {
  box-sizing: border-box;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

page{
  width: 100vw;
  height: 100vh;
  font-family: -apple-system-font,Helvetica Neue,Helvetica,sans-serif;
  font-size: 28rpx;
  color: #212121;
  background-color: #f2f2f2;
  overflow: hidden;
}

checkbox, radio{
  margin-right: 10rpx;
}

button{
  /* margin-top: 20rpx;
  margin-bottom: 20rpx; */
}
form{
  width: 100%;
}
input{
  background: transparent;
  border: none;
}
image{
  vertical-align: middle;
}
.page{
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.ab-f{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.ab-c{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.clearfix:after{
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
  zoom: 1;
}
.flex{
  display: flex;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ellipsis,
.max-line-1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.max-line-2,
.max-line-3 {
  word-break: break-all;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.;
}
/* 必须自己设定 max-height 并指定单位，不同字体大小高度不同，这里无法计算max-height */
.max-line-2 {
  -webkit-line-clamp: 2;
  /* max-height: 2.6; */
}
.max-line-3 {
  -webkit-line-clamp: 3;
  /* max-height: 3.9; */
}
.comment-star{
  position:absolute;
  right:40rpx;
  top:20rpx;
}
</style>
