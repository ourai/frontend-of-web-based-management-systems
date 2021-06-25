import { CreateElement, VNode } from 'vue';
import { ElTableColumn } from 'element-ui/types/table-column';

type TableColumn = Partial<ElTableColumn> & {
  render?: (
    h: CreateElement,
    data: { row: Record<string, any>; column: TableColumn; index: number },
  ) => VNode | string | null;
  isValid?: () => boolean;
  [key: string]: any;
};

export { TableColumn };
