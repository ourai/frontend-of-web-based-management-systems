import { RouteConfig } from '@/types';

import { routes as kokiri } from '../../../../../kokiri/blocks';

import session from './session';
import otaku from './otaku';
import spreadsheet from './spreadsheet';

export default ([
  { name: 'root', path: '/', redirect: '/otaku' },
  kokiri,
  otaku,
  spreadsheet,
] as RouteConfig[]).concat(session);
