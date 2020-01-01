<template>
  <scroll-view :scroll-x="true">
    <view class="comp-scroll-tab">
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @click="onClick(item.id, index)"
        >
        <view class="txt" :class="{'active': curt == index}">{{ item.name }}</view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default() {
          return [];
        }
      },
    },
    data() {
      return {
        curt: 0, // 下标
      }
    },
    methods: {
      onClick(id, index) {
        this.curt = index;
        this.$emit('switchTab', id);
      }
    }
  }
</script>

<style lang="scss">
.comp-scroll-tab{
  color: #212121;
  font-size: 26rpx;
  white-space: nowrap;
  .item{
    display: inline-block;
    height: 66rpx;
    line-height: 66rpx;
    padding: 0 28rpx;
  }
  .txt{
    position: relative;
    display: inline-block;
  }
  .active{
    color: #FF6600;
  }
  .active:after{
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4rpx;
    background-color: #FF6600;
  }
}
</style>
