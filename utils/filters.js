import Vue from 'vue';
import { dealPrice, dealDistance } from '@/utils/index';
import { formatDate } from '@/utils/dateUtil';

// 距离
Vue.filter('distance', dealDistance);

// 价格
Vue.filter('price', price => dealPrice(price, 100));

// 日期
Vue.filter('formatDate', formatDate);