import { VueConstructor, CreateElement } from 'vue';

import { ColumnContext, CellRenderer, TableColumn } from '@/types/table';
import { ListViewContext } from '@/types/context';
import { isFunction } from '@/utils/is';

import ActionRenderer from '../action-renderer';

function resolveCellRenderer(
  renderer: string | VueConstructor | CellRenderer<TableColumn>,
): CellRenderer<TableColumn> {
  if (isFunction(renderer)) {
    return (renderer as any).extendOptions
      ? (h: CreateElement, data: ColumnContext<TableColumn>) =>
          h(renderer as VueConstructor, { props: { value: data.row[data.column.prop!], ...data } })
      : (renderer as CellRenderer<TableColumn>);
  }

  return (h: CreateElement) => h('div');
}

function resolveTableColumns(context: ListViewContext<any>): TableColumn[] {
  const cols: TableColumn[] = context.getFields().map(({ name, label, render, config = {} }) => ({
    prop: name,
    label,
    render: render ? resolveCellRenderer(render) : undefined,
    ...config,
  }));

  cols.push({
    label: '操作',
    render: (h, { row }) =>
      h(
        'div',
        context.getActionsByContextType('single').map(action =>
          h(ActionRenderer, {
            props: { action, contextGetter: () => ({ ...context, getValue: () => [row] }) },
          }),
        ),
      ),
  });

  return cols;
}

export { resolveTableColumns };
