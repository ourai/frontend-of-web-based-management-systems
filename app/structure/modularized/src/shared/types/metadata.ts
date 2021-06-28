import { VueConstructor } from 'vue';

import { CellRenderer, TableColumn } from './table';

type Field = {
  name: string;
  label?: string;
  required?: boolean;
  render?: string | VueConstructor | CellRenderer<TableColumn>;
  config?: Omit<TableColumn, 'prop' | 'label' | 'render' | 'isValid'>;
};

export { Field };
