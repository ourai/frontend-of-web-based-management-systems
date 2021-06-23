import { RouteConfig } from 'vue-router';

import wiki from './wiki';

export default [{ name: 'root', path: '/', redirect: '/wiki' }, wiki] as RouteConfig[];
