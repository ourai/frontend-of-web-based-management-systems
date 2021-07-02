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
import { EventWithNamespace, EventHandler, EventHandlers } from './event';

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

interface ViewContextDescriptor<CT = Record<string, any>> extends ViewDescriptor<CT> {}

type ListShorthandRequestNames = {
  getList: string;
  deleteOne?: string;
  deleteList?: string;
};

type ListViewContextDescriptor<CT = Record<string, any>> = ViewContextDescriptor<CT> &
  ListShorthandRequestNames;

type ObjectShorthandRequestNames = {
  insert?: string;
  update?: string;
  getOne?: string;
};

type ObjectViewContextDescriptor<CT = Record<string, any>> = ViewContextDescriptor<CT> &
  ObjectShorthandRequestNames;

interface ViewContext<R = any, VT = any, CT = Record<string, any>>
  extends Pick<ModuleContext<R>, 'getModuleName' | 'getComponents' | 'execute'> {
  getView: () => ViewDescriptor<CT>;
  getFields: () => FieldDescriptor[];
  getActions: () => ActionDescriptor[];
  getActionsByContextType: (contextType: ActionContextType) => ActionDescriptor[];
  getActionsAuthority: () => string | undefined;
  getConfig: () => Record<string, any>;
  getDataSource: () => VT;
  setDataSource: (data: VT) => void;
  getValue: () => VT;
  setValue: (value: VT) => void;
  getBusy: () => boolean;
  setBusy: (busy: boolean) => void;
  on: (event: EventWithNamespace | EventHandlers, handler?: EventHandler) => void;
  off: (event?: EventWithNamespace, handler?: EventHandler) => void;
  emit: <PayloadType extends any = any>(event: EventWithNamespace, payload?: PayloadType) => void;
  attach: (vm: Vue) => void;
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => Promise<void>;
}

interface ListViewContext<R = any, VT = any, CT = Record<string, any>>
  extends ViewContext<R, VT, CT> {
  getSearch: () => SearchDescriptor | VueConstructor | undefined;
  getTotal: () => number;
  getCurrentPage: () => number;
  setCurrentPage: (current: number) => void;
  getPageSize: () => number;
  setPageSize: (size: number) => void;
  load: () => Promise<any>;
  reload: () => Promise<any>;
  getList: ShorthandRequest;
  deleteOne: ShorthandRequest<string | Record<string, any>>;
  deleteList: ShorthandRequest<string[] | Record<string, any>>;
}

interface ObjectViewContext<R = any, VT = any, CT = Record<string, any>>
  extends ViewContext<R, VT, CT> {
  getOne: ShorthandRequest<string>;
  insert: ShorthandRequest;
  update: ShorthandRequest;
}

type KeptViewContextKeysInAction =
  | 'getModuleName'
  | 'getView'
  | 'getValue'
  | 'execute'
  | 'commit'
  | 'dispatch'
  | 'reload'
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
  ListShorthandRequestNames,
  ListViewContextDescriptor,
  ObjectShorthandRequestNames,
  ObjectViewContextDescriptor,
  ViewContext,
  ListViewContext,
  ObjectViewContext,
  KeptViewContextKeysInAction,
  ViewContextInAction,
};
