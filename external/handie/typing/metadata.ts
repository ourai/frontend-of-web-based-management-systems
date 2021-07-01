import Vue, { VueConstructor, CreateElement, VNode } from 'vue';
import { ElTableColumn } from 'element-ui/types/table-column';

type ColumnContext<Column> = { row: Record<string, any>; column: Column; index: number };

type CellRenderer<Column> = (
  h: CreateElement,
  data: ColumnContext<Column>,
) => VNode | string | null;

type TableColumn = Partial<ElTableColumn> & {
  render?: CellRenderer<TableColumn>;
  isValid?: () => boolean;
  [key: string]: any;
};

type GenericRenderer<Identifier extends string = string> = Identifier | VueConstructor;

type FieldRenderer = GenericRenderer | CellRenderer<TableColumn>;

type FieldConfig = Omit<TableColumn, 'prop' | 'label' | 'render' | 'isValid'>;

type FieldDescriptor = {
  name: string;
  label?: string;
  required?: boolean;
  readonly?: boolean;
  render?: FieldRenderer;
  config?: FieldConfig;
};

type ActionConfig = Record<string, any>;

type ActionContextType = 'free' | 'single' | 'batch' | 'both';

type BuiltInActionRenderer = 'button' | 'link';

type ActionRenderer = GenericRenderer<BuiltInActionRenderer>;

type ActionDescriptor = {
  name?: string;
  context?: ActionContextType;
  authority?: string;
  text?: string;
  primary?: boolean;
  danger?: boolean;
  confirm?: boolean | string;
  render?: ActionRenderer;
  config?: ActionConfig;
  execute?: <ViewContext>(viewContext: ViewContext, vm: Vue) => Promise<any> | any;
};

type FilterDescriptor = Pick<FieldDescriptor, 'name' | 'label'>;

type SearchDescriptor = {
  filters: FilterDescriptor[];
};

type ViewType = 'list' | 'object';

interface ViewDescriptor<ConfigType = Record<string, any>> {
  name: string;
  type?: ViewType;
  render: GenericRenderer;
  fields: FieldDescriptor[];
  actions?: (ActionDescriptor | string)[];
  actionsAuthority?: string;
  search?: SearchDescriptor | VueConstructor;
  config?: ConfigType;
}

type TableViewConfig = {
  checkable?: boolean;
  operationColumnWidth?: number | string;
  hidePagination?: boolean;
};

export {
  ColumnContext,
  CellRenderer,
  TableColumn,
  GenericRenderer,
  FieldRenderer,
  FieldDescriptor,
  ActionContextType,
  BuiltInActionRenderer,
  ActionRenderer,
  ActionDescriptor,
  SearchDescriptor,
  ViewType,
  ViewDescriptor,
  TableViewConfig,
};
