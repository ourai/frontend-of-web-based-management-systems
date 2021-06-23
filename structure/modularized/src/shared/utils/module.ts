import { ModuleDescriptor } from '../types';

type ResolvedModule = Required<Pick<ModuleDescriptor, 'imports' | 'exports'>> & {
  dependencies: Record<string, any>;
};

const moduleMap = new Map<string, ResolvedModule>();

function registerModule(descriptor: ModuleDescriptor): ModuleDescriptor {
  const { name, imports = [], exports = {} } = descriptor;

  moduleMap.set(name, { imports, exports, dependencies: {} });

  return descriptor;
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

function getDependencies(moduleName: string) {
  const module = moduleMap.get(moduleName);

  if (!module) {
    return;
  }

  const dependencies = {} as any;

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

  return dependencies;
}

export { registerModules, getDependencies };
