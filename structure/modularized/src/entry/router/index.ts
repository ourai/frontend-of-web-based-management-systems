import { RouteConfig } from '@/types';

import otaku from './otaku';

export default [{ name: 'root', path: '/', redirect: '/otaku' }, otaku] as RouteConfig[];
