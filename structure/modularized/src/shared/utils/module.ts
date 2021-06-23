import { VueConstructor } from 'vue';

import { ModuleResourceType, ModuleDescriptor } from '../types';
import { isBoolean, isString } from './is';
import { getComponent } from './component';

type ResolvedModule = Required<Omit<ModuleDescriptor, 'name'>> & {
  dependencies: Record<string, any>;
};

type ModuleResources = Partial<Record<ModuleResourceType, any>>;

type ModuleDependencies = Record<string, ModuleResources>;

const moduleMap = new Map<string, ResolvedModule>();

function registerModule({
  name,
  imports = [],
  exports = {},
  components = {},
}: ModuleDescriptor): void {
  moduleMap.set(name, { imports, exports, components, dependencies: {} });
}

function getDependencyByRef(ref: string) {
  const [moduleName, resourceType, resourceName] = ref.split('.');

  const module = moduleMap.get(moduleName);

  if (!module) {
    return;
  }

  return module.exports[resourceType] && module.exports[resourceType][resourceName];
}

function resolveDependencies(): void {
  moduleMap.forEach((module, moduleName) =>
    moduleMap.set(moduleName, {
      ...module,
      dependencies: module.imports.reduce(
        (prev, ref) => ({ ...prev, [ref]: getDependencyByRef(ref) }),
        {},
      ),
    }),
  );
}

function registerModules(descriptors: ModuleDescriptor[]): void {
  descriptors.forEach(registerModule);
  resolveDependencies();
}

function getDependencies(
  moduleName: string,
  refPath?: string,
): ModuleDependencies | ModuleResources | undefined {
  const module = moduleMap.get(moduleName);

  if (!module) {
    return;
  }

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

function getComponents(moduleName: string): Record<string, VueConstructor> {
  const module = moduleMap.get(moduleName);

  if (!module) {
    return {};
  }

  const identifiers = module.components;

  let dependencies: ModuleDependencies;

  return Object.keys(identifiers).reduce((prev, id) => {
    const ref = identifiers[id];
    const useIdDirectly = isBoolean(ref);
    const refParts = isString(ref) ? (ref as string).split('.') : [];

    let resolvedComponent: VueConstructor | undefined;

    if (useIdDirectly || refParts.length === 1) {
      resolvedComponent = getComponent(useIdDirectly ? id : (ref as string));
    } else if (refParts.length === 3) {
      if (!dependencies) {
        dependencies = getDependencies(moduleName) as ModuleDependencies;
      }

      const [refModule, _, widgetName] = refParts;
      const { widgets } = dependencies[refModule];

      resolvedComponent = widgets && widgets[widgetName];
    }

    return resolvedComponent ? { ...prev, [id]: resolvedComponent } : prev;
  }, {});
}

export { registerModules, getDependencies, getComponents };
