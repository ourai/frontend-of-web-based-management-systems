import { isBoolean, isString } from '@ntks/toolbox';
import { VueConstructor } from 'vue';

import {
  ModuleResources,
  ModuleDependencies,
  ModuleComponentRefs,
  ModuleDescriptor,
} from './typing';
import { getComponent } from './component';

type ModuleComponents = Record<string, VueConstructor>;

type ResolvedModule = Required<Omit<ModuleDescriptor, 'name' | 'components'>> & {
  dependencies: Record<string, any>;
  componentRefs: ModuleComponentRefs;
  components: ModuleComponents;
};

const moduleMap = new Map<string, ResolvedModule>();

function ensureModuleExists(name: string): ResolvedModule {
  if (!moduleMap.has(name)) {
    moduleMap.set(name, {
      imports: [],
      exports: {},
      dependencies: {},
      componentRefs: {},
      components: {},
    });
  }

  return moduleMap.get(name)!;
}

function registerModule({
  name,
  imports = [],
  exports = {},
  components = {},
}: ModuleDescriptor): void {
  moduleMap.set(name, {
    imports,
    exports,
    dependencies: {},
    componentRefs: components,
    components: ensureModuleExists(name).components, // 必须保证 `components` 这个属性的引用地址不变，否则在模块未注册时在部件和页面中使用会找不到依赖组件
  });
}

function getDependencyByRef(ref: string) {
  const [moduleName, resourceType, resourceName] = ref.split('.');
  const module = ensureModuleExists(moduleName);

  return module.exports[resourceType] && module.exports[resourceType][resourceName];
}

function resolveDependencies(): void {
  moduleMap.forEach((module, name) =>
    moduleMap.set(name, {
      ...module,
      dependencies: module.imports.reduce(
        (prev, ref) => ({ ...prev, [ref]: getDependencyByRef(ref) }),
        {},
      ),
    }),
  );
}

function getDependencies(
  moduleName: string,
  refPath?: string,
): ModuleDependencies | ModuleResources | undefined {
  const module = ensureModuleExists(moduleName);
  const dependencies: ModuleDependencies = {};

  module.imports.forEach(ref => {
    const [dependencyModule, resourceType, resourceName] = ref.split('.');

    if (!dependencies[dependencyModule]) {
      dependencies[dependencyModule] = {};
    }

    if (!dependencies[dependencyModule][resourceType]) {
      dependencies[dependencyModule][resourceType] = {};
    }

    dependencies[dependencyModule][resourceType][resourceName] = module.dependencies[ref];
  });

  if (!refPath || !isString(refPath)) {
    return dependencies;
  }

  const [refModule, refResourceType] = refPath.split('.').slice(0, 2);
  const dependency = dependencies[refModule];

  if (!dependency) {
    return;
  }

  return refResourceType ? dependency[refResourceType] : (dependency as ModuleResources);
}

function resolveComponents(): void {
  moduleMap.forEach((module, name) => {
    const refs = module.componentRefs;

    let dependencies: ModuleDependencies;

    Object.keys(refs).forEach(id => {
      const ref = refs[id];
      const useIdDirectly = isBoolean(ref);
      const refParts = isString(ref) ? (ref as string).split('.') : [];

      let resolvedComponent: VueConstructor | undefined;

      if (useIdDirectly || refParts.length === 1) {
        resolvedComponent = getComponent(useIdDirectly ? id : (ref as string));
      } else if (refParts.length === 3) {
        if (!dependencies) {
          dependencies = getDependencies(name) as ModuleDependencies;
        }

        const [refModule, _, widgetName] = refParts;
        const { widgets } = dependencies[refModule];

        resolvedComponent = widgets && widgets[widgetName];
      }

      if (resolvedComponent) {
        module.components[id] = resolvedComponent;
      }
    });
  });
}

function registerModules(descriptors: ModuleDescriptor[]): void {
  descriptors.forEach(registerModule);
  resolveDependencies();
  resolveComponents();
}

function getComponents(moduleName: string): ModuleComponents {
  return ensureModuleExists(moduleName).components;
}

export { registerModules, getDependencies, getComponents };
