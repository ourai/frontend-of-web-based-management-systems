import { VueConstructor } from 'vue';

import { RequestParams, ResponseResult, ResponseSuccess, ResponseFail } from './http';
import { ModuleDependencies, ModuleResources } from './module';
import { Field, ActionContextType, Action } from './metadata';

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

type ViewContextOptions<ConfigType = Record<string, any>> = {
  fields: Field[];
  actions?: (Action | string)[];
  config?: ConfigType;
};

type ListViewContextOptions = ViewContextOptions<{ hidePagination?: boolean }> & {
  getList: string;
  deleteOne?: string;
  deleteList?: string;
};

type ObjectViewContextOptions = ViewContextOptions & {
  insert?: string;
  update?: string;
};

type ViewContext<Repository = any> = Pick<ModuleContext<Repository>, 'execute'> & {
  getModuleName: () => string;
  getComponents: () => Record<string, VueConstructor>;
  getFields: () => Field[];
  getActions: () => Action[];
  getActionsByContextType: (contextType: ActionContextType) => Action[];
  getConfig: () => Record<string, any>;
  attach: (vm: Vue) => void;
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => Promise<void>;
};

type ListViewContext<Repository = any, ValueType = any> = ViewContext<Repository> & {
  getValue: <VT = ValueType>() => VT[];
  getList: ShorthandRequest;
  deleteOne: ShorthandRequest<string | Record<string, any>>;
  deleteList: ShorthandRequest<string[] | Record<string, any>>;
};

type ObjectViewContext<Repository = any, ValueType = any> = ViewContext<Repository> &
  Record<'insert' | 'update', ShorthandRequest> & {
    getValue: <VT = ValueType>() => VT;
  };

export {
  RepositoryExecutor,
  ModuleContext,
  ViewContextOptions,
  ListViewContextOptions,
  ObjectViewContextOptions,
  ViewContext,
  ListViewContext,
  ObjectViewContext,
};
