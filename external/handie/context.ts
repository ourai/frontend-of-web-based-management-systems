import { isFunction } from '@ntks/toolbox';
import Vue, { VueConstructor } from 'vue';

import {
  RequestParams,
  ResponseResult,
  ResponseSuccess,
  ResponseFail,
  ActionContextType,
  ActionDescriptor,
  RepositoryExecutor,
  ModuleContext,
  ViewContextDescriptor,
  ListViewContextDescriptor,
  ObjectViewContextDescriptor,
  ViewContext,
  ListShorthandRequests,
  ListViewContext,
  ObjectShorthandRequest,
  ObjectViewContext,
  KeptViewContextKeysInAction,
  ViewContextInAction,
} from './typing';
import { noop, omit } from './helper';
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

function createGenericViewContext<R, CT>(
  moduleContext: ModuleContext<R>,
  options: ViewContextDescriptor<R, CT>,
): ViewContext<R, CT> {
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
    ...options,
    execute: moduleContext.execute,
    getModuleName: moduleContext.getModuleName,
    getComponents: moduleContext.getComponents,
    getActions: () => actions,
    getActionsByContextType: (contextType: ActionContextType) => actionContextGroups[contextType],
    getConfig: () => (options.config || {}) as CT,
    attach: (vm: Vue) => (_vm = vm),
    getView: () => _vm,
    commit: callVuexMethod.bind(null, 'commit'),
    dispatch: async (type: string, payload?: any) => callVuexMethod('dispatch', type, payload),
    refresh: options.refresh || noop,
  };
}

function resolvePartialContext<
  R,
  ViewContextDescriptor,
  SpecificViewContext,
  SpecificActionName extends keyof SpecificViewContext
>(
  executor: RepositoryExecutor<keyof R>,
  options: ViewContextDescriptor,
  actionNames: SpecificActionName[],
) {
  const actionMap = {} as Pick<SpecificViewContext, SpecificActionName>;

  Object.keys(options).forEach(key => {
    if (actionNames.some(name => name === key)) {
      actionMap[key] = executor.bind(null, options[key] as any);
    }
  });

  return actionMap;
}

function createListViewContext<R, VT, CT>(
  moduleContext: ModuleContext<R>,
  options: ListViewContextDescriptor<R, CT>,
): ListViewContext<R, VT, CT> {
  return {
    ...createGenericViewContext<R, CT>(moduleContext, options),
    ...resolvePartialContext<
      R,
      ListViewContextDescriptor<R, CT>,
      ListViewContext<R, VT, CT>,
      keyof ListShorthandRequests
    >(moduleContext.execute, options, ['getList', 'deleteOne', 'deleteList']),
    getValue: () => [],
  };
}

function createObjectViewContext<R, VT, CT>(
  moduleContext: ModuleContext<R>,
  options: ObjectViewContextDescriptor<R, CT>,
): ObjectViewContext<R, VT, CT> {
  return {
    ...createGenericViewContext<R, CT>(moduleContext, options),
    ...resolvePartialContext<
      R,
      ObjectViewContextDescriptor<R, CT>,
      ObjectViewContext<R, VT, CT>,
      keyof ObjectShorthandRequest
    >(moduleContext.execute, options, ['insert', 'update', 'getOne']),
    getValue: () => ({} as any),
  };
}

function createViewContext<R, VT, CT>(
  moduleContext: ModuleContext<R>,
  options: ListViewContextDescriptor<R, CT> | ObjectViewContextDescriptor<R, CT>,
): ListViewContext<R, VT, CT> | ObjectViewContext<R, VT, CT> {
  return options.type === 'object'
    ? (createObjectViewContext<R, VT, CT>(
        moduleContext,
        options as ObjectViewContextDescriptor<R, CT>,
      ) as ObjectViewContext<R, VT, CT>)
    : (createListViewContext<R, VT, CT>(
        moduleContext,
        options as ListViewContextDescriptor<R, CT>,
      ) as ListViewContext<R, VT, CT>);
}

function createView<R, VT, CT>(
  context: ModuleContext<R> | ListViewContext<R, VT, CT> | ObjectViewContext<R, VT, CT>,
  options?: ListViewContextDescriptor<R, CT> | ObjectViewContextDescriptor<R, CT>,
): VueConstructor {
  const resolved = options
    ? createViewContext(context as ModuleContext<R>, options)
    : (context as ListViewContext<R, VT, CT> | ObjectViewContext<R, VT, CT>);

  return Vue.extend({
    name: resolved.name,
    components: resolved.getComponents(),
    provide: { context: resolved },
    render: h => h(resolved.render),
  });
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

export { createModuleContext, createViewContext, createView, resolveViewContextInAction };
