import { VNodeData } from 'vue';

import { Action } from '@/types/metadata';

const DEFAULT_ACTION_COMPONENT = 'OlButton';

function resolveVirtualNodeData({
  render = DEFAULT_ACTION_COMPONENT,
  config = {},
}: Action): VNodeData {
  const nodeData: VNodeData = { staticClass: 'ActionRenderer' };

  if (render === DEFAULT_ACTION_COMPONENT) {
    const props: Record<string, any> = {};

    if (config.primary) {
      props.color = 'primary';
    }

    if (config.danger) {
      props.color = 'danger';

      nodeData.on = { click: () => alert('Danger!') };
    }

    nodeData.props = props;
  } else {
    nodeData.props = config;
  }

  return nodeData;
}

export { DEFAULT_ACTION_COMPONENT, resolveVirtualNodeData };
