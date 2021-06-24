import { VueConstructor } from 'vue';

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
  execute: RepositoryExecutor<keyof Repository>;
  getDependencies: (refPath?: string) => ModuleDependencies | ModuleResources | undefined;
  getComponents: () => Record<string, VueConstructor>;
};

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
    execute: createRepositoryExecutor(repository),
    getDependencies: getDependencies.bind(null, moduleName),
    getComponents: getComponents.bind(null, moduleName),
  };
}

export { createModuleContext };