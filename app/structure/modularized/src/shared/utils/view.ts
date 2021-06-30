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
  options?: ListViewContextOptions<R>,
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

function createObjectView<R>(
  context: ObjectViewContext<R> | ModuleContext<R>,
  viewName: string,
  componentName: string,
  options?: ObjectViewContextOptions<R>,
): VueConstructor {
  const resolved: ObjectViewContext<R> = options
    ? createObjectViewContext(context as ModuleContext<R>, options)
    : (context as ObjectViewContext<R>);

  return Vue.extend({
    name: viewName,
    components: resolved.getComponents(),
    provide: { context: resolved },
    render: h => h(componentName),
  });
}

function createDetailView<R>(
  context: ObjectViewContext<R> | ModuleContext<R>,
  options?: ObjectViewContextOptions<R>,
): VueConstructor {
  return createObjectView(
    context,
    `${capitalize(context.getModuleName())}Detail`,
    'DetailView',
    options,
  );
}

function createFormView<R>(
  context: ObjectViewContext<R> | ModuleContext<R>,
  options?: ObjectViewContextOptions<R>,
): VueConstructor {
  return createObjectView(
    context,
    `${capitalize(context.getModuleName())}Form`,
    'FormView',
    options,
  );
}

export { createTableView, createDetailView, createFormView };
