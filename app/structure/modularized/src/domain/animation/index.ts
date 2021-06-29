import { ModuleDescriptor } from '@/types';

import { MODULE_NAME, testUtil } from './helper';
import TestWidget from './widgets/test-widget';

export default {
  name: MODULE_NAME,
  imports: ['common.widgets.TableView', 'common.widgets.FormView'],
  exports: {
    utils: { test: testUtil },
    widgets: { test: TestWidget },
  },
  components: {
    OlButton: true,
    TableView: 'common.widgets.TableView',
    FormView: 'common.widgets.FormView',
  },
} as ModuleDescriptor;
