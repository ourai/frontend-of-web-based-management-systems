import { VueConstructor, CreateElement } from 'vue';

import { ColumnContext, CellRenderer, TableColumn } from '@/types/table';
import { ActionDescriptor, TableViewConfig } from '@/types/metadata';
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

function isActionsAuthorized(
  actionsAuthority: string | undefined,
  authority: Record<string, boolean> | null,
): boolean {
  if (!actionsAuthority) {
    return true;
  }

  return authority ? !!authority[actionsAuthority] : false;
}

function resolveAuthorizedActions(
  actions: ActionDescriptor[],
  actionsAuthority: string | undefined,
  authority: Record<string, boolean> | null,
): ActionDescriptor[] {
  if (actionsAuthority) {
    return actions;
  }

  if (!authority) {
    return [];
  }

  return actions.filter(({ authority: auth }) => !auth || !!authority[auth]);
}

function resolveOperationColumn(
  context: ListViewContext,
  authority: Record<string, boolean> | null,
): TableColumn | null {
  const actionsAuthority = context.getActionsAuthority();

  const actions = resolveAuthorizedActions(
    context.getActionsByContextType('single'),
    actionsAuthority,
    authority,
  );

  return isActionsAuthorized(actionsAuthority, authority) && actions.length > 0
    ? {
        label: '操作',
        render: (h, { row }) => {
          return h(
            'div',
            actions.map(action =>
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
          );
        },
      }
    : null;
}

function resolveTableColumns(
  context: ListViewContext,
  authority: Record<string, boolean> | null,
): TableColumn[] {
  const cols: TableColumn[] = context.getFields().map(({ name, label, render, config = {} }) => ({
    prop: name,
    label,
    render: render ? resolveCellRenderer(render) : undefined,
    ...config,
  }));

  const checkableActions = isActionsAuthorized(context.getActionsAuthority(), authority)
    ? resolveAuthorizedActions(
        ([] as ActionDescriptor[]).concat(
          context.getActionsByContextType('batch') || [],
          context.getActionsByContextType('both') || [],
        ),
        context.getActionsAuthority(),
        authority,
      )
    : [];

  if ((context.getConfig() as TableViewConfig).checkable && checkableActions.length > 0) {
    cols.unshift({ type: 'selection', width: '55', align: 'center' });
  }

  const operationCol = resolveOperationColumn(context, authority);

  if (operationCol) {
    cols.push(operationCol);
  }

  return cols;
}

function resolveTableProps(
  context: ListViewContext,
  authority: Record<string, boolean> | null,
): DataTableProps {
  return {
    ...omit(context.getConfig(), ['checkable']),
    columns: resolveTableColumns(context, authority),
  };
}

export { isActionsAuthorized, resolveAuthorizedActions, resolveTableProps };