import Vue from 'vue';

import { ActionDescriptor } from '../types/metadata';
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
    execute: (context: ListViewContext, vm) =>
      vm.$router.push({
        name: `${context.getModuleName()}EditForm`,
        params: { id: context.getValue()[0].id },
      }),
  },
  {
    name: 'gotoDetailView',
    context: 'single',
    text: '查看',
    execute: (context: ListViewContext, vm) =>
      vm.$router.push({
        name: `${context.getModuleName()}Detail`,
        params: { id: context.getValue()[0].id },
      }),
  },
  {
    name: 'deleteOne',
    context: 'single',
    text: '删除',
    danger: true,
    execute: (context: ListViewContext, vm: Vue) =>
      context.deleteOne &&
      context.deleteOne(context.getValue()[0]).then(() => {
        context.refresh(context, vm);
      }),
  },
  {
    name: 'deleteList',
    context: 'batch',
    text: '批量删除',
    danger: true,
    execute: (context: ListViewContext, vm: Vue) =>
      context.deleteList &&
      context.deleteList(context.getValue()).then(() => context.refresh(context, vm)),
  },
] as ActionDescriptor[]).reduce((prev, action) => ({ ...prev, [action.name!]: action }), {});

function resolveAction(refOrDescriptor: string | ActionDescriptor): ActionDescriptor | undefined {
  if (isString(refOrDescriptor)) {
    return builtInActions[refOrDescriptor as string];
  }

  const descriptor = refOrDescriptor as ActionDescriptor;
  const builtInAction = builtInActions[descriptor.name!];

  return builtInAction ? { ...builtInAction, ...descriptor } : descriptor;
}

export { resolveAction };
