import Vue, { VueConstructor } from 'vue';

import { RequestParams, ResponseResult, ResponseSuccess, ResponseFail } from '../types';
import { ActionContextType, ActionDescriptor } from '../types/metadata';
import {
  RepositoryExecutor,
  ModuleContext,
  ViewContextOptions,
  ListViewContextOptions,
  ObjectViewContextOptions,
  ViewContext,
  ListViewContext,
  ObjectViewContext,
  ViewContextInAction,
} from '../types/context';

import { isFunction } from './is';
import { capitalize } from './string';
import { noop } from './function';
import { omit } from './object';
import { getDependencies, getComponents } from './module';
import { resolveAction } from './action';

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
  options: ViewContextOptions<CT>,
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
    getFields: () => options.fields,
    getActions: () => actions,
    getActionsByContextType: (contextType: ActionContextType) => actionContextGroups[contextType],
    getConfig: () => (options.config || {}) as CT,
    attach: (vm: Vue) => (_vm = vm),
    commit: callVuexMethod.bind(null, 'commit'),
    dispatch: async (type: string, payload?: any) => callVuexMethod('dispatch', type, payload),
  };
}

function createViewContextFactory<R>(
  moduleContext: ModuleContext<R>,
): (options: ViewContextOptions) => ViewContext<R> {
  return (options: ViewContextOptions) => createViewContext(moduleContext, options);
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
  options: ListViewContextOptions,
): ListViewContext<R> {
  return {
    ...resolvePartialContext<
      R,
      ListViewContextOptions,
      ListViewContext<R>,
      'getList' | 'deleteOne' | 'deleteList'
    >(moduleContext.execute, options, ['getList', 'deleteOne', 'deleteList']),
    ...createViewContext(moduleContext, options),
    getValue: () => [],
  };
}

function createListViewContextFactory<R>(
  moduleContext: ModuleContext<R>,
): (options: ListViewContextOptions) => ListViewContext<R> {
  return (options: ListViewContextOptions) => createListViewContext(moduleContext, options);
}

function createObjectViewContext<R>(
  moduleContext: ModuleContext<R>,
  options: ObjectViewContextOptions,
): ObjectViewContext<R> {
  return {
    ...resolvePartialContext<
      R,
      ObjectViewContextOptions,
      ObjectViewContext<R>,
      'insert' | 'update'
    >(moduleContext.execute, options, ['insert', 'update']),
    ...createViewContext(moduleContext, options),
    getValue: () => ({} as any),
  };
}

function createObjectViewContextFactory<R>(
  moduleContext: ModuleContext<R>,
): (options: ObjectViewContextOptions) => ObjectViewContext<R> {
  return (options: ObjectViewContextOptions) => createObjectViewContext(moduleContext, options);
}

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

function resolveViewContextInAction<VC extends ViewContext = ViewContext>(
  context: VC,
): ViewContextInAction<VC> {
  return omit(context, [
    'getModuleName',
    'getComponents',
    'getActions',
    'getActionsByContextType',
    'getFields',
    'getConfig',
    'attach',
  ]);
}

export {
  createModuleContext,
  createViewContextFactory,
  createListViewContextFactory,
  createObjectViewContextFactory,
  createTableView,
  resolveViewContextInAction,
};
