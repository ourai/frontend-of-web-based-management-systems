import { VueConstructor } from 'vue';

const componentMap = new Map<string, VueConstructor>();

function registerComponent(name: string, ctor: VueConstructor): void {
  componentMap.set(name, ctor);
}

function getComponent(name: string): VueConstructor | undefined {
  return componentMap.get(name);
}

export { registerComponent, getComponent };
