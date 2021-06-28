import { CreateElement, VNode } from 'vue';
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

export { ColumnContext, CellRenderer, TableColumn };
