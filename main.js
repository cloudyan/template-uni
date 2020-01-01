import Vue from 'vue'
import App from './App'
import store from './store'
import mini from './utils/mini.js'
import mixins from './utils/mixins.js'
import './utils/filters.js'
import api from './api/index.js'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$api = api

for (const key in mini) {
  Vue.prototype[`$${key}`] = mini[key];
}

Vue.mixin(mixins)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})

app.$mount()
