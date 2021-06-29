import { VueConstructor, CreateElement } from 'vue';

import { ColumnContext, CellRenderer, TableColumn } from '@/types/table';
import { TableViewConfig } from '@/types/metadata';
import { ListViewContext } from '@/types/context';
import { isFunction } from '@/utils/is';
import { omit } from '@/utils/object';
import { resolveViewContextInAction } from '@/utils/context';

import ActionRenderer from '../action-renderer';
import { DataTableProps } from './typing';

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

function resolveTableColumns(context: ListViewContext): TableColumn[] {
  const cols: TableColumn[] = context.getFields().map(({ name, label, render, config = {} }) => ({
    prop: name,
    label,
    render: render ? resolveCellRenderer(render) : undefined,
    ...config,
  }));

  if ((context.getConfig() as TableViewConfig).checkable) {
    cols.unshift({ type: 'selection', width: '55', align: 'center' });
  }

  cols.push({
    label: '操作',
    render: (h, { row }) =>
      h(
        'div',
        context.getActionsByContextType('single').map(action =>
          h(ActionRenderer, {
            props: {
              action,
              contextGetter: () => ({
                ...resolveViewContextInAction(context),
                getValue: () => [row],
              }),
            },
          }),
        ),
      ),
  });

  return cols;
}

function resolveTableProps(context: ListViewContext): DataTableProps {
  return { ...omit(context.getConfig(), ['checkable']), columns: resolveTableColumns(context) };
}

export { resolveTableProps };
