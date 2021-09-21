import Vuex from 'vuex';
import { createApp } from 'handie-vue';

import components from '@/components';
import modules from '../domain';
import plugins from './plugins';
import actions from './actions';
import { setInterceptors } from './aspects';
import routes from './routes';
import theme from './theme';

setInterceptors();

createApp({
  plugins: [Vuex, ...plugins],
  creators: { store: moduleTree => new Vuex.Store({ modules: moduleTree }) },
  components,
  metadata: { actions, modules },
  theme,
  el: '#app',
  routes,
});
