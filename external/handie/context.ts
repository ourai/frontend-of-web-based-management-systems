import { isFunction } from '@ntks/toolbox';
import Vue, { VueConstructor } from 'vue';

import {
  Pagination,
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
  ListShorthandRequestNames,
  ListViewContext,
  ObjectShorthandRequestNames,
  ObjectViewContext,
  KeptViewContextKeysInAction,
  ViewContextInAction,
  EventListeners,
} from './typing';
import { noop, omit } from './helper';
import { getDependencies, getComponents } from './module';
import { resolveAction } from './action';
import { bindEvent, unbindEvent, triggerEvent } from './event';

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

function createGenericViewContext<R, VT, CT>(
  moduleContext: ModuleContext<R>,
  options: ViewContextDescriptor<CT>,
): Omit<
  ViewContext<R, VT, CT>,
  'getDataSource' | 'setDataSource' | 'getValue' | 'setValue' | 'getBusy' | 'setBusy'
> {
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

  const listeners = {} as EventListeners;

  return {
    execute: moduleContext.execute,
    getModuleName: moduleContext.getModuleName,
    getComponents: moduleContext.getComponents,
    getView: () => options,
    getFields: () => options.fields,
    getActions: () => actions,
    getActionsByContextType: (contextType: ActionContextType) => actionContextGroups[contextType],
    getActionsAuthority: () => options.actionsAuthority,
    getConfig: () => (options.config || {}) as CT,
    on: bindEvent.bind(null, listeners),
    off: unbindEvent.bind(null, listeners),
    emit: triggerEvent.bind(null, listeners),
    attach: (vm: Vue) => (_vm = vm),
    commit: callVuexMethod.bind(null, 'commit'),
    dispatch: async (type: string, payload?: any) => callVuexMethod('dispatch', type, payload),
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
  options: ListViewContextDescriptor<CT>,
): ListViewContext<R, VT, CT> {
  const ctx = {
    ...createGenericViewContext<R, VT, CT>(moduleContext, options),
    ...resolvePartialContext<
      R,
      ListViewContextDescriptor<CT>,
      ListViewContext<R, VT, CT>,
      keyof ListShorthandRequestNames
    >(moduleContext.execute, options, ['getList', 'deleteOne', 'deleteList']),
  };

  let dataSource: VT = [] as any;
  let val: VT = [] as any;
  let loading: boolean = false;

  let totalPage: number;
  let currentPage: number;
  let currentPageSize: number;

  const setDataSource = (data: VT) => {
    dataSource = data;
    ctx.emit('dataChange', data);
  };

  const setTotal = (total: number) => {
    totalPage = total;
    ctx.emit('totalChange', total);
  };

  const setBusy = (busy: boolean) => {
    loading = busy;
    ctx.emit('busyChange', busy);
  };

  const loadData = async () => {
    const pagination = {} as Pagination;

    if (currentPage) {
      pagination.pageNum = currentPage;
    }

    if (currentPageSize) {
      pagination.pageSize = currentPageSize;
    }

    setBusy(true);

    ctx
      .getList(pagination, (data, { pageNum, pageSize, total }) => {
        setDataSource(data);
        setTotal(total);

        ctx.emit('currentPageChange', pageNum);
        ctx.emit('pageSizeChange', pageSize);
      })
      .finally(() => setBusy(false));
  };

  const setCurrentPage = (current: number) => {
    currentPage = current;
    loadData();
  };

  const setPageSize = (pageSize: number) => {
    currentPageSize = pageSize;
    loadData();
  };

  return {
    ...ctx,
    getDataSource: () => dataSource,
    setDataSource,
    getValue: () => val,
    setValue: (value: VT) => (val = value),
    getBusy: () => loading,
    setBusy,
    getSearch: () => options.search,
    getTotal: () => totalPage,
    getCurrentPage: () => currentPage,
    setCurrentPage,
    getPageSize: () => currentPageSize,
    setPageSize,
    load: loadData,
    reload: loadData,
  };
}

function createObjectViewContext<R, VT, CT>(
  moduleContext: ModuleContext<R>,
  options: ObjectViewContextDescriptor<CT>,
): ObjectViewContext<R, VT, CT> {
  const ctx = {
    ...createGenericViewContext<R, VT, CT>(moduleContext, options),
    ...resolvePartialContext<
      R,
      ObjectViewContextDescriptor<CT>,
      ObjectViewContext<R, VT, CT>,
      keyof ObjectShorthandRequestNames
    >(moduleContext.execute, options, ['insert', 'update', 'getOne']),
  };

  let dataSource: VT = {} as any;
  let val: VT = {} as any;
  let loading: boolean = false;

  return {
    ...ctx,
    getDataSource: () => dataSource,
    setDataSource: (data: VT) => {
      dataSource = data;
      ctx.emit('dataChange', data);
    },
    getValue: () => val,
    setValue: (value: VT) => (val = value),
    getBusy: () => loading,
    setBusy: (busy: boolean) => {
      loading = busy;
      ctx.emit('busyChange', loading);
    },
  };
}

function createViewContext<R, VT, CT>(
  moduleContext: ModuleContext<R>,
  options: ListViewContextDescriptor<CT> | ObjectViewContextDescriptor<CT>,
): ListViewContext<R, VT, CT> | ObjectViewContext<R, VT, CT> {
  return options.type === 'object'
    ? (createObjectViewContext<R, VT, CT>(
        moduleContext,
        options as ObjectViewContextDescriptor<CT>,
      ) as ObjectViewContext<R, VT, CT>)
    : (createListViewContext<R, VT, CT>(
        moduleContext,
        options as ListViewContextDescriptor<CT>,
      ) as ListViewContext<R, VT, CT>);
}

function createView<R, VT, CT>(
  context: ModuleContext<R> | ListViewContext<R, VT, CT> | ObjectViewContext<R, VT, CT>,
  options?: ListViewContextDescriptor<CT> | ObjectViewContextDescriptor<CT>,
): VueConstructor {
  const resolved = options
    ? createViewContext(context as ModuleContext<R>, options)
    : (context as ListViewContext<R, VT, CT> | ObjectViewContext<R, VT, CT>);
  const view = resolved.getView();

  return Vue.extend({
    name: view.name,
    components: resolved.getComponents(),
    provide: { context: resolved },
    render: h => h(view.render),
  });
}

function resolveViewContextInAction<VC extends ViewContext = ViewContext>(
  context: VC,
): ViewContextInAction<VC> {
  const keptKeys: KeptViewContextKeysInAction[] = [
    'getModuleName',
    'getView',
    'getValue',
    'execute',
    'commit',
    'dispatch',
    'reload',
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
