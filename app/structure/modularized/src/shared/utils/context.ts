import Vue from 'vue';

import { RequestParams, ResponseResult, ResponseSuccess, ResponseFail } from '../types';
import { Field } from '../types/metadata';
import {
  RepositoryExecutor,
  ModuleContext,
  ViewContext,
  ListViewContext,
  ObjectViewContext,
} from '../types/context';

import { isFunction } from './is';
import { noop } from './function';
import { getDependencies, getComponents } from './module';

type ListViewContextOptions = {
  fields: Field[];
  getList: string;
  deleteOne?: string;
  deleteList?: string;
};

type ObjectViewContextOptions = {
  fields: Field[];
  insert?: string;
  update?: string;
};

function isResultLogicallySuccessful(result: ResponseResult): boolean {
  return result.success === true;
}

function createRepositoryExecutor<Repository>(
  repository: Repository,
  resultAsserter: (
    result: ResponseResult,
    actionName: keyof Repository,
  ) => boolean = isResultLogicallySuccessful,
): RepositoryExecutor<keyof Repository> {
  return async function (
    actionName: keyof Repository,
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

function createModuleContext<Repository>(
  moduleName: string,
  repository: Repository,
): ModuleContext<Repository> {
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

function createViewContext<Repository>(
  moduleContext: ModuleContext<Repository>,
): ViewContext<Repository> {
  let _vm: Vue | undefined;

  const callVuexMethod = callVuexMethodWithNamespace.bind(
    null,
    () => _vm,
    moduleContext.getModuleName(),
  );

  return {
    execute: moduleContext.execute,
    getComponents: moduleContext.getComponents,
    attach: (vm: Vue) => (_vm = vm),
    commit: callVuexMethod.bind(null, 'commit'),
    dispatch: async (type: string, payload?: any) => callVuexMethod('dispatch', type, payload),
  };
}

function createViewContextFactory<Repository>(
  moduleContext: ModuleContext<Repository>,
): () => ViewContext<Repository> {
  return () => createViewContext(moduleContext);
}

function resolvePartialContext<
  Repository,
  ViewContextOptions,
  SpecificViewContext,
  SpecificActionName extends keyof SpecificViewContext
>(
  executor: RepositoryExecutor<keyof Repository>,
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

function createListViewContextFactory<Repository>(
  moduleContext: ModuleContext<Repository>,
): (options: ListViewContextOptions) => ListViewContext<Repository> {
  return (options: ListViewContextOptions) => ({
    getFields: () => options.fields,
    ...resolvePartialContext<
      Repository,
      ListViewContextOptions,
      ListViewContext<Repository>,
      'getList' | 'deleteOne' | 'deleteList'
    >(moduleContext.execute, options, ['getList', 'deleteOne', 'deleteList']),
    ...createViewContext(moduleContext),
  });
}

function createObjectViewContextFactory<Repository>(
  moduleContext: ModuleContext<Repository>,
): (options: ObjectViewContextOptions) => ObjectViewContext<Repository> {
  return (options: ObjectViewContextOptions) => ({
    getFields: () => options.fields,
    ...resolvePartialContext<
      Repository,
      ObjectViewContextOptions,
      ObjectViewContext<Repository>,
      'insert' | 'update'
    >(moduleContext.execute, options, ['insert', 'update']),
    ...createViewContext(moduleContext),
  });
}

export {
  createModuleContext,
  createViewContextFactory,
  createListViewContextFactory,
  createObjectViewContextFactory,
};
