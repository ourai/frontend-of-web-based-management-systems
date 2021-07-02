import { isString } from '@ntks/toolbox';
import { Vue, Component, Inject } from 'vue-property-decorator';

import { EventWithNamespace, EventHandler, EventHandlers, ViewContext } from '../typing';

@Component
export default class ViewWidget<ViewContextType extends ViewContext = ViewContext> extends Vue {
  @Inject({ from: 'context', default: null })
  protected readonly context!: ViewContextType;

  private getEventWithNamespace(event: string): EventWithNamespace {
    return `${event}.vue_inst_${(this as any)._uid}`;
  }

  protected on(event: string | EventHandlers, handler?: EventHandler): void {
    let resolved: EventWithNamespace | EventHandlers;

    if (isString(event)) {
      resolved = this.getEventWithNamespace(event as string);
    } else {
      resolved = {} as EventHandlers;

      Object.keys(event as EventHandlers).forEach(key => {
        resolved[this.getEventWithNamespace(key)] = (event as EventHandlers)[key];
      });
    }

    this.context.on(resolved, handler);
  }

  protected off(event?: string, handler?: EventHandler): void {
    this.context.off(this.getEventWithNamespace(event || ''), handler);
  }

  protected created(): void {
    this.context.attach(this);
  }

  protected beforeDestroy(): void {
    this.off();
  }
}
