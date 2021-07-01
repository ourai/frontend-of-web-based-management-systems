import Vue, { VNodeData, VueConstructor } from 'vue';
import { MessageBox } from 'element-ui';
import {
  ActionRenderer,
  MixedActionRenderer,
  ActionDescriptor,
  ViewContext,
  ListViewContext,
  noop,
} from 'handie-vue';

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
  viewContext: ViewContext,
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

    if (action.context === 'batch') {
      props.disabled = (viewContext as ListViewContext).getValue().length === 0;
    }

    nodeData.props = props;
  } else {
    nodeData.props = action.config || {};
  }

  let beforeExecute: ((callback: () => Promise<void>) => void) | undefined;

  if (action.danger || action.confirm) {
    beforeExecute = callback =>
      MessageBox.confirm(
        isString(action.confirm)
          ? (action.confirm as string)
          : `确定要${action.text || '执行此操作'}？`,
        '提示',
        { type: 'warning' },
      )
        .then(callback)
        .catch(noop);
  }

  const executeAction = async () => {
    if (action.execute) {
      await Promise.resolve(action.execute(viewContext, vm));
    }
  };

  nodeData.on = {
    click: () => {
      if (beforeExecute) {
        beforeExecute(executeAction);
      } else {
        executeAction();
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
