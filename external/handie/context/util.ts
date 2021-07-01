import { isString, isFunction, capitalize } from '@ntks/toolbox';
import Vue, { VueConstructor } from 'vue';

import { noop } from '../function';
import { omit } from '../object';
import { RequestParams, ResponseResult, ResponseSuccess, ResponseFail } from '../http';
import { ActionContextType, ActionDescriptor } from '../metadata';
import { getDependencies, getComponents } from '../module';

import {
  RepositoryExecutor,
  ModuleContext,
  ViewContextOptions,
  ListViewContextOptions,
  ObjectViewContextOptions,
  ViewContext,
  ListViewContext,
  ObjectViewContext,
  KeptViewContextKeysInAction,
  ViewContextInAction,
} from './typing';

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

function isResultLogicallySuccessful(result: ResponseResult): boolean {
  return result.success === true;
}

function createRepositoryExecutor<R>(
  repository: R,
  resultAsserter: (
    result: ResponseResult,
    actionName: keyof R,
  ) => boolean = isResultLogicallySuccessful,
): RepositoryExecutor<keyof R> {
  return async function (
    actionName: keyof R,
    params?: RequestParams | ResponseSuccess,
    success?: ResponseSuccess | ResponseFail,
    fail?: ResponseFail,
  ): Promise<ResponseResult> {
    if (!(actionName in repository)) {
      return {} as ResponseResult;
    }

    let resolvedParams: RequestParams;
    let resolvedSuccessCallback: ResponseSuccess;
    let resolvedFailCallback: ResponseFail;

    if (params && isFunction(params)) {
      resolvedParams = undefined;
      resolvedSuccessCallback = (params || noop) as ResponseSuccess;
      resolvedFailCallback = (success || noop) as ResponseFail;
    } else {
      resolvedParams = params;
      resolvedSuccessCallback = (success || noop) as ResponseSuccess;
      resolvedFailCallback = fail || noop;
    }

    const result: ResponseResult = await (repository[actionName] as any)(resolvedParams);

    if (resultAsserter(result, actionName)) {
      resolvedSuccessCallback(result.data, result.extra, result);
    } else {
      resolvedFailCallback(result.message, result);
    }

    return result;
  };
}

function createModuleContext<R>(moduleName: string, repository: R): ModuleContext<R> {
  return {
    getModuleName: () => moduleName,
    getDependencies: getDependencies.bind(null, moduleName),
    getComponents: getComponents.bind(null, moduleName),
    execute: createRepositoryExecutor(repository),
  };
}

function callVuexMethodWithNamespace(
  vmGetter: () => Vue | undefined,
  namespace: string,
  methodName: 'commit' | 'dispatch',
  type: string,
  payload?: any,
): void {
  const vm = vmGetter();
  console.log(methodName, vm, namespace, type, payload);

  if (!vm || !(vm as any).$store) {
    return;
  }

  (vm as any).$store[methodName](`${namespace}/${type}`, payload);
}

function createViewContext<R, CT>(
  moduleContext: ModuleContext<R>,
  options: ViewContextOptions<R, CT>,
): ViewContext<R> {
  let _vm: Vue | undefined;

  const callVuexMethod = callVuexMethodWithNamespace.bind(
    null,
    () => _vm,
    moduleContext.getModuleName(),
  );

  const actions = (options.actions || [])
    .map(resolveAction)
    .filter(action => !!action) as ActionDescriptor[];
  const actionContextGroups = {} as Record<ActionContextType, ActionDescriptor[]>;

  actions.forEach(action => {
    const contextType = action.context || 'single';

    if (!actionContextGroups[contextType]) {
      actionContextGroups[contextType] = [] as ActionDescriptor[];
    }

    actionContextGroups[contextType].push(action);
  });

  return {
    execute: moduleContext.execute,
    getModuleName: moduleContext.getModuleName,
    getComponents: moduleContext.getComponents,
    getSearch: () => options.search,
    getFields: () => options.fields,
    getActions: () => actions,
    getActionsByContextType: (contextType: ActionContextType) => actionContextGroups[contextType],
    getActionsAuthority: () => options.actionsAuthority,
    getConfig: () => (options.config || {}) as CT,
    attach: (vm: Vue) => (_vm = vm),
    getView: () => _vm,
    commit: callVuexMethod.bind(null, 'commit'),
    dispatch: async (type: string, payload?: any) => callVuexMethod('dispatch', type, payload),
    refresh: options.refresh || noop,
  };
}

function createViewContextFactory<R>(
  moduleContext: ModuleContext<R>,
): (options: ViewContextOptions<R>) => ViewContext<R> {
  return (options: ViewContextOptions<R>) => createViewContext(moduleContext, options);
}

function resolvePartialContext<
  R,
  ViewContextOptions,
  SpecificViewContext,
  SpecificActionName extends keyof SpecificViewContext
>(
  executor: RepositoryExecutor<keyof R>,
  options: ViewContextOptions,
  actionNames: SpecificActionName[],
) {
  const actionMap = {} as Pick<SpecificViewContext, SpecificActionName>;
  const otherOptions = {} as Omit<ViewContextOptions, SpecificActionName>;

  Object.keys(options).forEach(key => {
    const val = options[key];

    if (actionNames.some(name => name === key)) {
      actionMap[key] = executor.bind(null, val as any);
    } else {
      otherOptions[key] = val;
    }
  });

  return { ...actionMap, ...otherOptions };
}

function createListViewContext<R>(
  moduleContext: ModuleContext<R>,
  options: ListViewContextOptions<R>,
): ListViewContext<R> {
  return {
    ...resolvePartialContext<
      R,
      ListViewContextOptions<R>,
      ListViewContext<R>,
      'getList' | 'deleteOne' | 'deleteList'
    >(moduleContext.execute, options, ['getList', 'deleteOne', 'deleteList']),
    ...createViewContext(moduleContext, options),
    getValue: () => [],
  };
}

function createListViewContextFactory<R>(
  moduleContext: ModuleContext<R>,
): (options: ListViewContextOptions<R>) => ListViewContext<R> {
  return (options: ListViewContextOptions<R>) => createListViewContext(moduleContext, options);
}

function createObjectViewContext<R>(
  moduleContext: ModuleContext<R>,
  options: ObjectViewContextOptions<R>,
): ObjectViewContext<R> {
  return {
    ...resolvePartialContext<
      R,
      ObjectViewContextOptions<R>,
      ObjectViewContext<R>,
      'insert' | 'update' | 'getOne'
    >(moduleContext.execute, options, ['insert', 'update', 'getOne']),
    ...createViewContext(moduleContext, options),
    getValue: () => ({} as any),
  };
}

function createObjectViewContextFactory<R>(
  moduleContext: ModuleContext<R>,
): (options: ObjectViewContextOptions<R>) => ObjectViewContext<R> {
  return (options: ObjectViewContextOptions<R>) => createObjectViewContext(moduleContext, options);
}

function resolveViewContextInAction<VC extends ViewContext = ViewContext>(
  context: VC,
): ViewContextInAction<VC> {
  const keptKeys: KeptViewContextKeysInAction[] = [
    'getModuleName',
    'getView',
    'execute',
    'commit',
    'dispatch',
    'refresh',
    'getList',
    'deleteOne',
    'deleteList',
  ];

  return omit(
    context,
    Object.keys(context).filter(key => keptKeys.indexOf(key as any) === -1),
  );
}

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

export {
  createModuleContext,
  createViewContextFactory,
  createListViewContext,
  createListViewContextFactory,
  createObjectViewContext,
  createObjectViewContextFactory,
  resolveViewContextInAction,
  createTableView,
  createDetailView,
  createFormView,
};
