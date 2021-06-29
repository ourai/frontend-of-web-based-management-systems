import Vue, { VNodeData, VueConstructor } from 'vue';

import { ActionRenderer, MixedActionRenderer, ActionDescriptor } from '@/types/metadata';
import { ViewContext } from '@/types/context';
import { isString } from '@/utils/is';

const DEFAULT_ACTION_RENDER_TYPE = 'button';

function resolveActionComponent(renderer: ActionRenderer): string {
  return renderer === 'button' ? 'OlButton' : 'OlLink';
}

function getDefaultActionComponent(): string {
  return resolveActionComponent(DEFAULT_ACTION_RENDER_TYPE);
}

function getActionComponent(
  renderer: MixedActionRenderer = DEFAULT_ACTION_RENDER_TYPE,
): string | VueConstructor {
  return isString(renderer)
    ? resolveActionComponent(renderer as ActionRenderer)
    : (renderer as VueConstructor);
}

function resolveVirtualNodeData(
  action: ActionDescriptor,
  viewContext: ViewContext<any>,
  vm: Vue,
): VNodeData {
  const nodeData: VNodeData = { staticClass: 'ActionRenderer' };
  const renderer = action.render || DEFAULT_ACTION_RENDER_TYPE;

  if (renderer === 'button') {
    const props: Record<string, any> = {};

    if (action.primary) {
      props.color = 'primary';
    }

    if (action.danger) {
      props.color = 'danger';
    }

    nodeData.props = props;
  } else {
    nodeData.props = action.config || {};
  }

  let beforeExecute: () => void | undefined;

  if (action.danger || action.confirm) {
    beforeExecute = () =>
      alert(isString(action.confirm) ? action.confirm : `确定要${action.text || '执行此操作'}？`);
  }

  nodeData.on = {
    click: () => {
      if (beforeExecute) {
        beforeExecute();
      }

      if (action.execute) {
        action.execute(viewContext, vm);
      }
    },
  };

  return nodeData;
}

export {
  DEFAULT_ACTION_RENDER_TYPE,
  getDefaultActionComponent,
  getActionComponent,
  resolveVirtualNodeData,
};
