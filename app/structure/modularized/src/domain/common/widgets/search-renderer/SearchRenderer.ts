import { VueConstructor, CreateElement, VNode } from 'vue';
import { Vue, Component, Inject } from 'vue-property-decorator';
import { ViewContext } from 'handie-vue';

import { isFunction } from '@/utils/is';

@Component({
  // @ts-ignore
  abstract: true,
})
export default class SearchRenderer extends Vue {
  @Inject({ from: 'context', default: null })
  private readonly context!: ViewContext;

  private render(h: CreateElement): VNode | null {
    const search = this.context.search;

    return isFunction(search) ? h(search as VueConstructor) : null;
  }
}
