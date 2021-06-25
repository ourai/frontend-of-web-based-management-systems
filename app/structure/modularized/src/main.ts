import Vue, { CreateElement, VNode } from 'vue';
import VueRouter from 'vue-router';

import '@kokiri/themes/antd/index.scss';

import './shared/components';
import './domain';
import { routes, setInterceptors } from './entry';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

setInterceptors();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: (h: CreateElement): VNode => h(App),
  router: new VueRouter({ mode: 'history', routes }),
  provide: { routes },
});