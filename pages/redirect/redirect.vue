<template>
  <view></view>
</template>

<script>
export default {
  data() {
    return {}
  },
  onLoad() {
    let url = decodeURIComponent(this.pageQuery.url);
    if (url.indexOf('?') >= 0) {
      url += '&replace=1';
    } else {
      url += '?replace=1';
    }
    const result = { currentTarget: { dataset: {url: url, index: this.pageQuery.index} } };
    this.$onUrlPage(result);
  }
}
</script>
