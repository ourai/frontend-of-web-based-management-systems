import { ModuleDescriptor } from '@/types';

import { MODULE_NAME } from './helper';
import TableView from './widgets/table-view';

export default {
  name: MODULE_NAME,
  exports: {
    widgets: {
      TableView,
    },
  },
  components: {
    DataTable: true,
  },
} as ModuleDescriptor;
