import { VueConstructor } from 'vue';

import { RequestParams, ResponseResult, ResponseSuccess, ResponseFail } from './http';
import { ModuleDependencies, ModuleResources } from './module';
import { Field } from './metadata';

type ShorthandRequest<ParamsType = RequestParams> = (
  params: ParamsType,
  success?: ResponseSuccess,
  fail?: ResponseFail,
) => Promise<ResponseResult>;

type RepositoryExecutor<ActionName = any, DataType = any> = {
  (
    actionName: ActionName,
    success?: ResponseSuccess<DataType>,
    fail?: ResponseFail<DataType>,
  ): Promise<ResponseResult<DataType>>;
  (
    actionName: ActionName,
    params: RequestParams,
    success?: ResponseSuccess<DataType>,
    fail?: ResponseFail<DataType>,
  ): Promise<ResponseResult<DataType>>;
};

type ModuleContext<Repository> = {
  getModuleName: () => string;
  getDependencies: (refPath?: string) => ModuleDependencies | ModuleResources | undefined;
  getComponents: () => Record<string, VueConstructor>;
  execute: RepositoryExecutor<keyof Repository>;
};

type ViewContext<Repository> = Pick<ModuleContext<Repository>, 'execute'> & {
  getModuleName: () => string;
  getComponents: () => Record<string, VueConstructor>;
  attach: (vm: Vue) => void;
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => Promise<void>;
};

type ListViewContext<Repository> = ViewContext<Repository> & {
  getFields: () => Field[];
  getConfig: () => Record<string, any>;
  getList: ShorthandRequest;
  deleteOne: ShorthandRequest<string | Record<string, any>>;
  deleteList: ShorthandRequest<string[] | Record<string, any>>;
};

type ObjectViewContext<Repository> = ViewContext<Repository> &
  Record<'insert' | 'update', ShorthandRequest> & {
    getFields: () => Field[];
    getConfig: () => Record<string, any>;
  };

export { RepositoryExecutor, ModuleContext, ViewContext, ListViewContext, ObjectViewContext };
