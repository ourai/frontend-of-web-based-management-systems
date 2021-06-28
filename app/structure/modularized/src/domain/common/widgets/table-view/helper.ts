import { VueConstructor, CreateElement } from 'vue';

import { ColumnContext, CellRenderer, TableColumn } from '@/types/table';
import { Field } from '@/types/metadata';
import { isFunction } from '@/utils/is';

function resolveCellRenderer(
  renderer: string | VueConstructor | CellRenderer<TableColumn>,
): CellRenderer<TableColumn> {
  if (isFunction(renderer)) {
    return renderer.extendOptions
      ? (h: CreateElement, data: ColumnContext<TableColumn>) =>
          h(renderer as VueConstructor, { props: { value: data.row[data.column.prop], ...data } })
      : renderer;
  }
}

function resolveTableColumns(fields: Field[]): TableColumn[] {
  return fields.map(({ name, label, render, config = {} }) => {
    return {
      prop: name,
      label,
      render: resolveCellRenderer(render),
      ...config,
    };
  });
}

export { resolveTableColumns };
