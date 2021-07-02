import { VueConstructor } from 'vue';

import {
  ModuleContext,
  ViewType,
  ListViewContextDescriptor,
  ListViewContext,
  ObjectViewContextDescriptor,
  ObjectViewContext,
  createView,
} from 'handie-vue';

type UncertainContext<R, CTT> = ModuleContext<R> | CTT;

type UnionViewContextDescriptor<CT> =
  | ListViewContextDescriptor<CT>
  | ObjectViewContextDescriptor<CT>;

type PartialOptions<OT> = Omit<OT, 'type' | 'render'>;

function resolveView<R, VT, CT>(
  type: ViewType,
  render: string,
  context: UncertainContext<R, ListViewContext<R, VT, CT> | ObjectViewContext<R, VT, CT>>,
  options?: PartialOptions<UnionViewContextDescriptor<CT>>,
): VueConstructor {
  let resolved: UnionViewContextDescriptor<CT> | undefined;

  if (options) {
    resolved = { ...options, type, render };
  } else {
    resolved = undefined;
  }

  return createView<R, VT, CT>(context, resolved);
}

function createTableView<R, VT, CT>(
  context: UncertainContext<R, ListViewContext<R, VT, CT>>,
  options?: PartialOptions<ListViewContextDescriptor<CT>>,
): VueConstructor {
  return resolveView<R, VT, CT>('list', 'TableView', context, options);
}

function createDetailView<R, VT, CT>(
  context: UncertainContext<R, ObjectViewContext<R, VT, CT>>,
  options?: PartialOptions<ObjectViewContextDescriptor<CT>>,
): VueConstructor {
  return resolveView<R, VT, CT>('object', 'DetailView', context, options);
}

function createFormView<R, VT, CT>(
  context: UncertainContext<R, ObjectViewContext<R, VT, CT>>,
  options?: PartialOptions<ObjectViewContextDescriptor<CT>>,
): VueConstructor {
  return resolveView<R, VT, CT>('object', 'FormView', context, options);
}

export { createTableView, createDetailView, createFormView };
