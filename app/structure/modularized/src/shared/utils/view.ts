import Vue, { VueConstructor } from 'vue';

import {
  ModuleContext,
  ListViewContextOptions,
  ListViewContext,
  ObjectViewContextOptions,
  ObjectViewContext,
} from '../types/context';
import { capitalize } from './string';
import { createListViewContext, createObjectViewContext } from './context';

function createTableView<R>(
  context: ListViewContext<R> | ModuleContext<R>,
  options?: ListViewContextOptions,
): VueConstructor {
  const resolved: ListViewContext<R> = options
    ? createListViewContext(context as ModuleContext<R>, options)
    : (context as ListViewContext<R>);

  return Vue.extend({
    name: `${capitalize(resolved.getModuleName())}List`,
    components: resolved.getComponents(),
    provide: { context: resolved },
    render: h => h('TableView'),
  });
}

function createFormView<R>(
  context: ObjectViewContext<R> | ModuleContext<R>,
  options?: ObjectViewContextOptions,
): VueConstructor {
  const resolved: ObjectViewContext<R> = options
    ? createObjectViewContext(context as ModuleContext<R>, options)
    : (context as ObjectViewContext<R>);

  return Vue.extend({
    name: `${capitalize(resolved.getModuleName())}Form`,
    components: resolved.getComponents(),
    provide: { context: resolved },
    render: h => h('FormView'),
  });
}

export { createTableView, createFormView };
