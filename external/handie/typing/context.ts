import Vue, { VueConstructor } from 'vue';

import { RequestParams, ResponseResult, ResponseSuccess, ResponseFail } from './http';
import { ModuleDependencies, ModuleResources } from './module';
import {
  FieldDescriptor,
  ActionContextType,
  ActionDescriptor,
  SearchDescriptor,
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

interface ModuleContext<R> {
  getModuleName: () => string;
  getDependencies: (refPath?: string) => ModuleDependencies | ModuleResources | undefined;
  getComponents: () => Record<string, VueConstructor>;
  execute: RepositoryExecutor<keyof R>;
}

interface InternalViewContextOptions<VC = any, CT = Record<string, any>>
  extends ViewDescriptor<CT> {
  refresh?: (context: VC, vm: Vue) => Promise<any> | any;
}

interface InternalViewContext<R = any, CT = Record<string, any>>
  extends Pick<ModuleContext<R>, 'getModuleName' | 'getComponents' | 'execute'> {
  getActions: () => ActionDescriptor[];
  getActionsByContextType: (contextType: ActionContextType) => ActionDescriptor[];
  getConfig: () => Record<string, any>;
  attach: (vm: Vue) => void;
  getView: () => Vue | undefined;
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => Promise<void>;
  refresh: (
    context: InternalViewContextOptions<InternalViewContext<R>, CT> & InternalViewContext<R>,
    vm: Vue,
  ) => Promise<any> | any;
}

type ViewContextOptions<R = any, CT = Record<string, any>> = InternalViewContextOptions<
  InternalViewContext<R, CT>,
  CT
>;

type ListViewContextOptions<R = any, CT = Record<string, any>> = ViewContextOptions<R, CT> & {
  getList: string;
  deleteOne?: string;
  deleteList?: string;
};

type ObjectViewContextOptions<R = any, CT = Record<string, any>> = ViewContextOptions<R, CT> & {
  insert?: string;
  update?: string;
  getOne?: string;
};

type ViewContext<R = any, CT = Record<string, any>> = InternalViewContextOptions<
  ViewContext<R, CT>,
  CT
> &
  InternalViewContext<R, CT>;

type ListViewContext<R = any, VT = any, CT = Record<string, any>> = ViewContext<R, CT> & {
  getValue: <ValueType = VT>() => ValueType[];
  getList: ShorthandRequest;
  deleteOne: ShorthandRequest<string | Record<string, any>>;
  deleteList: ShorthandRequest<string[] | Record<string, any>>;
};

type ObjectViewContext<R = any, VT = any, CT = Record<string, any>> = ViewContext<R, CT> &
  Record<'insert' | 'update', ShorthandRequest> & {
    getOne: ShorthandRequest<string>;
    getValue: <ValueType = VT>() => ValueType;
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
