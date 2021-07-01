import Vue, { VueConstructor } from 'vue';

import { RequestParams, ResponseResult, ResponseSuccess, ResponseFail } from './http';
import { ModuleDependencies, ModuleResources } from './module';
import {
  FieldDescriptor,
  ActionContextType,
  ActionDescriptor,
  SearchDescriptor,
  TableViewConfig,
  ViewDescriptor,
} from './metadata';

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

type ViewContext<Repository = any> = Pick<ModuleContext<Repository>, 'execute'> & {
  getModuleName: () => string;
  getComponents: () => Record<string, VueConstructor>;
  getSearch: () => SearchDescriptor | VueConstructor | undefined;
  getFields: () => FieldDescriptor[];
  getActions: () => ActionDescriptor[];
  getActionsByContextType: (contextType: ActionContextType) => ActionDescriptor[];
  getActionsAuthority: () => string | undefined;
  getConfig: () => Record<string, any>;
  attach: (vm: Vue) => void;
  getView: () => Vue | undefined;
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => Promise<void>;
  refresh: (context: ViewContext<Repository>, vm: Vue) => Promise<any> | any;
};

type ListViewContext<Repository = any, ValueType = any> = ViewContext<Repository> & {
  getValue: <VT = ValueType>() => VT[];
  getList: ShorthandRequest;
  deleteOne: ShorthandRequest<string | Record<string, any>>;
  deleteList: ShorthandRequest<string[] | Record<string, any>>;
};

type ObjectViewContext<Repository = any, ValueType = any> = ViewContext<Repository> &
  Record<'insert' | 'update', ShorthandRequest> & {
    getOne: ShorthandRequest<string>;
    getValue: <VT = ValueType>() => VT;
  };

type ViewContextOptions<R = any, ConfigType = Record<string, any>> = ViewDescriptor<ConfigType> & {
  refresh?: (context: ViewContext<R>, vm: Vue) => Promise<any> | any;
};

type ListViewContextOptions<R = any> = ViewContextOptions<R, TableViewConfig> & {
  getList: string;
  deleteOne?: string;
  deleteList?: string;
};

type ObjectViewContextOptions<R = any> = ViewContextOptions<R> & {
  insert?: string;
  update?: string;
  getOne?: string;
};

type KeptViewContextKeysInAction =
  | 'getModuleName'
  | 'getView'
  | 'execute'
  | 'commit'
  | 'dispatch'
  | 'refresh'
  | 'getList'
  | 'deleteOne'
  | 'deleteList';

type ViewContextInAction<VC = ViewContext> = Omit<
  VC,
  keyof Omit<ViewContext, KeptViewContextKeysInAction>
>;

export {
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
};
