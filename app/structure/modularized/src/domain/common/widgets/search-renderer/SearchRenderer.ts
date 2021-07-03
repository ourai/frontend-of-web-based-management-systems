import { isFunction } from '@ntks/toolbox';
import { VueConstructor, CreateElement, VNode } from 'vue';
import { Vue, Component, Inject } from 'vue-property-decorator';
import { ListViewContext } from 'handie-vue';

@Component({
  // @ts-ignore
  abstract: true,
})
export default class SearchRenderer extends Vue {
  @Inject({ from: 'context', default: null })
  private readonly context!: ListViewContext;

  private render(h: CreateElement): VNode | null {
    const search = this.context.getSearch();

    return isFunction(search) ? h(search as VueConstructor) : null;
  }
}
