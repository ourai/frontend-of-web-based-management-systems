import Vue, { VueConstructor } from 'vue';

import { RequestParams, ResponseResult, ResponseSuccess, ResponseFail } from '../types';

import { isFunction } from './is';
import { ModuleDependencies, ModuleResources, getDependencies, getComponents } from './module';

type RepositoryExecutor<ActionName = any> = {
  (actionName: ActionName, success?: ResponseSuccess, fail?: ResponseFail): Promise<ResponseResult>;
  (
    actionName: ActionName,
    params: RequestParams,
    success?: ResponseSuccess,
    fail?: ResponseFail,
  ): Promise<ResponseResult>;
};

type ModuleContext<Repository> = {
  getModuleName: () => string;
  getDependencies: (refPath?: string) => ModuleDependencies | ModuleResources | undefined;
  getComponents: () => Record<string, VueConstructor>;
  execute: RepositoryExecutor<keyof Repository>;
};

type ViewContext<Repository> = Pick<ModuleContext<Repository>, 'execute'> & {
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => Promise<void>;
};

type ListViewContext<Repository> = ViewContext<Repository>;

type ObjectViewContext<Repository> = ViewContext<Repository>;

function noop() {} // eslint-disable-line @typescript-eslint/no-empty-function

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
  vm: Vue | undefined,
  namespace: string,
  methodName: 'commit' | 'dispatch',
  type: string,
  payload?: any,
): void {
  if (!vm || !(vm as any).$store) {
    return;
  }

  (vm as any).$store[methodName](`${namespace}/${type}`, payload);
}

function createViewContext<Repository>(
  moduleContext: ModuleContext<Repository>,
  vm?: Vue,
): ViewContext<Repository> {
  const callVuexMethod = callVuexMethodWithNamespace.bind(null, vm, moduleContext.getModuleName());

  return {
    execute: moduleContext.execute,
    commit: callVuexMethod.bind(null, 'commit'),
    dispatch: async (type: string, payload?: any) => callVuexMethod('dispatch', type, payload),
  };
}

function createViewContextFactory<Repository>(
  moduleContext: ModuleContext<Repository>,
): (vm?: Vue) => ViewContext<Repository> {
  return (vm?: Vue) => createViewContext(moduleContext, vm);
}

function createListViewContextFactory<Repository>(
  moduleContext: ModuleContext<Repository>,
): (options, vm?: Vue) => ListViewContext<Repository> {
  return (options, vm?: Vue) => ({ ...createViewContext(moduleContext, vm) });
}

function createObjectViewContextFactory<Repository>(
  moduleContext: ModuleContext<Repository>,
): (options, vm?: Vue) => ObjectViewContext<Repository> {
  return (options, vm?: Vue) => ({ ...createViewContext(moduleContext, vm) });
}

export {
  createModuleContext,
  createViewContextFactory,
  createListViewContextFactory,
  createObjectViewContextFactory,
};
