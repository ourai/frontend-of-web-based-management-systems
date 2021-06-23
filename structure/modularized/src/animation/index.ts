import { ModuleDescriptor } from '@/types';

import { testUtil } from './helper';
import TestWidget from './widgets/test-widget';

export default {
  name: 'animation',
  exports: {
    utils: { test: testUtil },
    widgets: { test: TestWidget },
  },
} as ModuleDescriptor;
