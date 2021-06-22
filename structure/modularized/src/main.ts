import Vue, { CreateElement, VNode } from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: (h: CreateElement): VNode => h(App),
});
