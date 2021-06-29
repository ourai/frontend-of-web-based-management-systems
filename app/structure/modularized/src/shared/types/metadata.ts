import { VueConstructor } from 'vue';

import { CellRenderer, TableColumn } from './table';

type Renderer = string | VueConstructor;

type FieldConfig = Omit<TableColumn, 'prop' | 'label' | 'render' | 'isValid'>;

type Field = {
  name: string;
  label?: string;
  required?: boolean;
  render?: Renderer | CellRenderer<TableColumn>;
  config?: FieldConfig;
};

type ActionConfig = {
  primary?: boolean;
  danger?: boolean;
};

type ActionContextType = 'free' | 'single' | 'batch' | 'both';

type Action = {
  context?: ActionContextType;
  text?: string;
  render?: Renderer;
  config?: ActionConfig;
};

export { Field, ActionContextType, Action };
