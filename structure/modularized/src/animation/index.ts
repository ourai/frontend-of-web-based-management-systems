import { ModuleDescriptor } from '@/types';

import { MODULE_NAME, testUtil } from './helper';
import TestWidget from './widgets/test-widget';

export default {
  name: MODULE_NAME,
  exports: {
    utils: { test: testUtil },
    widgets: { test: TestWidget },
  },
} as ModuleDescriptor;
