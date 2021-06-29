import { Action } from '../types/metadata';
import { ViewContext, ListViewContext } from '../types/context';
import { isString } from './is';

const builtInActions = ([
  {
    name: 'gotoCreateFormView',
    context: 'free',
    text: '新增',
    execute: (context: ViewContext, vm) =>
      vm.$router.push({ name: `${context.getModuleName()}NewForm` }),
  },
  {
    name: 'gotoEditFormView',
    context: 'single',
    text: '编辑',
    execute: (context: ViewContext, vm) =>
      vm.$router.push({ name: `${context.getModuleName()}EditForm`, params: { id: 'genius' } }),
  },
  {
    name: 'gotoDetailView',
    context: 'single',
    text: '查看',
    execute: (context: ViewContext, vm) =>
      vm.$router.push({ name: `${context.getModuleName()}Detail`, params: { id: 'genius' } }),
  },
  {
    name: 'deleteOne',
    context: 'single',
    text: '删除',
    danger: true,
    execute: (context: ListViewContext) =>
      context.deleteOne && context.deleteOne(context.getValue()[0]),
  },
  {
    name: 'deleteList',
    context: 'batch',
    text: '批量删除',
    danger: true,
    execute: (context: ListViewContext) =>
      context.deleteList && context.deleteList(context.getValue()),
  },
] as Action[]).reduce((prev, action) => ({ ...prev, [action.name!]: action }), {});

function resolveAction(refOrDescriptor: string | Action): Action | undefined {
  if (isString(refOrDescriptor)) {
    return builtInActions[refOrDescriptor as string];
  }

  const descriptor = refOrDescriptor as Action;
  const builtInAction = builtInActions[descriptor.name!];

  return builtInAction ? { ...builtInAction, ...descriptor } : descriptor;
}

export { resolveAction };
