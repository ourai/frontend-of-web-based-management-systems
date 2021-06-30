import Vue, { VueConstructor } from 'vue';

import { CellRenderer, TableColumn } from './table';

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
  authority?: string;
  text?: string;
  primary?: boolean;
  danger?: boolean;
  confirm?: boolean | string;
  render?: MixedActionRenderer;
  config?: ActionConfig;
  execute?: <ViewContext>(viewContext: ViewContext, vm: Vue) => Promise<any> | any;
};

type TableViewConfig = { checkable?: boolean; hidePagination?: boolean };

type ViewDescriptor<ConfigType = Record<string, any>> = {
  fields: FieldDescriptor[];
  actions?: (ActionDescriptor | string)[];
  actionsAuthority?: string;
  config?: ConfigType;
};

export {
  FieldDescriptor,
  ActionContextType,
  ActionRenderer,
  MixedActionRenderer,
  ActionDescriptor,
  TableViewConfig,
  ViewDescriptor,
};
