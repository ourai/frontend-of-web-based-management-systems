import { CreateElement, VNode } from 'vue';
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Action } from '@/types/metadata';

import { getComponents } from '../../context';
import { DEFAULT_ACTION_COMPONENT, resolveVirtualNodeData } from './helper';

@Component({
  // @ts-ignore
  abstract: true,
  components: getComponents(),
})
export default class ActionRenderer extends Vue {
  @Prop({ type: Object, default: null })
  private readonly action!: Action;

  private render(h: CreateElement): VNode | null {
    if (!this.action) {
      return null;
    }

    const { render = DEFAULT_ACTION_COMPONENT, text } = this.action;

    return h(render, resolveVirtualNodeData(this.action), text);
  }
}
