import { VueConstructor } from 'vue';

import { TableColumn } from './table';

type Field = {
  name: string;
  label?: string;
  required?: boolean;
  render?: string | VueConstructor;
  config?: Omit<TableColumn, 'prop' | 'label' | 'render' | 'isValid'>;
};

export { Field };
