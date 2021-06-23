import { ModuleDescriptor } from '@/types';

import { testUtil } from './helper';

export default { name: 'animation', exports: { utils: { test: testUtil } } } as ModuleDescriptor;
