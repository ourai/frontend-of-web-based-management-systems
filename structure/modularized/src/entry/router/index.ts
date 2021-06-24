import { RouteConfig } from 'vue-router';

import otaku from './otaku';

export default [{ name: 'root', path: '/', redirect: '/otaku' }, otaku] as RouteConfig[];
