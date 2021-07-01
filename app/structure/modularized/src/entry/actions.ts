import { ActionDescriptor, ViewContext, ListViewContext, registerAction } from 'handie-vue';

([
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
] as ActionDescriptor[]).forEach(action => registerAction(action));
