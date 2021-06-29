import { CreateElement, VNode } from 'vue';
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';

import { Action } from '@/types/metadata';
import { ViewContext } from '@/types/context';

import { getComponents } from '../../context';
import { getActionComponent, resolveVirtualNodeData } from './helper';

@Component({
  // @ts-ignore
  abstract: true,
  components: getComponents(),
})
export default class ActionRenderer extends Vue {
  @Inject({ from: 'context', default: null })
  private readonly context!: ViewContext<any>;

  @Prop({ type: Object, default: null })
  private readonly action!: Action;

  private render(h: CreateElement): VNode | null {
    return this.action
      ? h(
          getActionComponent(this.action.render),
          resolveVirtualNodeData(this.action, this.context, this),
          this.action.text || '',
        )
      : null;
  }
}
