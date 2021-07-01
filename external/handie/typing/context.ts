import Vue, { VueConstructor } from 'vue';

import { RequestParams, ResponseResult, ResponseSuccess, ResponseFail } from './http';
import { ModuleDependencies, ModuleResources } from './module';
import { ActionContextType, ActionDescriptor, ViewDescriptor } from './metadata';

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

interface IntermediateContextDescriptor<VC, CT> extends ViewDescriptor<CT> {
  refresh?: (context: VC, vm: Vue) => Promise<any> | any;
}

interface IntermediateViewContext<R, CT>
  extends Pick<ModuleContext<R>, 'getModuleName' | 'getComponents' | 'execute'> {
  getActions: () => ActionDescriptor[];
  getActionsByContextType: (contextType: ActionContextType) => ActionDescriptor[];
  getConfig: () => Record<string, any>;
  attach: (vm: Vue) => void;
  getView: () => Vue | undefined;
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => Promise<void>;
  refresh: (
    context: IntermediateContextDescriptor<IntermediateViewContext<R, CT>, CT> &
      IntermediateViewContext<R, CT>,
    vm: Vue,
  ) => Promise<any> | any;
}

type ViewContextDescriptor<R = any, CT = Record<string, any>> = IntermediateContextDescriptor<
  IntermediateViewContext<R, CT>,
  CT
>;

type ListShorthandRequestNames = {
  getList: string;
  deleteOne?: string;
  deleteList?: string;
};

type ListViewContextDescriptor<R = any, CT = Record<string, any>> = ViewContextDescriptor<R, CT> &
  ListShorthandRequestNames;

type ObjectShorthandRequestNames = {
  insert?: string;
  update?: string;
  getOne?: string;
};

type ObjectViewContextDescriptor<R = any, CT = Record<string, any>> = ViewContextDescriptor<R, CT> &
  ObjectShorthandRequestNames;

type ViewContext<R = any, CT = Record<string, any>> = IntermediateContextDescriptor<
  ViewContext<R, CT>,
  CT
> &
  IntermediateViewContext<R, CT>;

type ListShorthandRequests = {
  getList: ShorthandRequest;
  deleteOne: ShorthandRequest<string | Record<string, any>>;
  deleteList: ShorthandRequest<string[] | Record<string, any>>;
};

type ListContextMethods<VT> = ListShorthandRequests & {
  getValue: <ValueType = VT>() => ValueType[];
};

type ListViewContext<R = any, VT = any, CT = Record<string, any>> = ViewContext<R, CT> &
  ListContextMethods<VT>;

type ObjectShorthandRequest = Record<'insert' | 'update', ShorthandRequest> & {
  getOne: ShorthandRequest<string>;
};

type ObjectContextMethods<VT> = ObjectShorthandRequest & {
  getValue: <ValueType = VT>() => ValueType;
};

type ObjectViewContext<R = any, VT = any, CT = Record<string, any>> = ViewContext<R, CT> &
  ObjectContextMethods<VT>;

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
};
