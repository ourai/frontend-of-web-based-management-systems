import Vue, { VueConstructor } from 'vue';

import { CellRenderer, TableColumn } from './table';

type TableViewConfig = { checkable?: boolean; hidePagination?: boolean };

type FieldConfig = Omit<TableColumn, 'prop' | 'label' | 'render' | 'isValid'>;

type FieldDescriptor = {
  name: string;
  label?: string;
  required?: boolean;
  render?: string | VueConstructor | CellRenderer<TableColumn>;
  config?: FieldConfig;
};

type ActionConfig = Record<string, any>;

type ActionContextType = 'free' | 'single' | 'batch' | 'both';

type ActionRenderer = 'button' | 'link';

type MixedActionRenderer = ActionRenderer | VueConstructor;

type ActionDescriptor = {
  name?: string;
  context?: ActionContextType;
  text?: string;
  primary?: boolean;
  danger?: boolean;
  confirm?: boolean | string;
  render?: MixedActionRenderer;
  config?: ActionConfig;
  execute?: <ViewContext>(viewContext: ViewContext, vm: Vue) => Promise<any> | any;
};

export {
  TableViewConfig,
  FieldDescriptor,
  ActionContextType,
  ActionRenderer,
  MixedActionRenderer,
  ActionDescriptor,
};
