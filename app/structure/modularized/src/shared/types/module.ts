type ModuleResourceType = 'services' | 'utils' | 'widgets';

type ModuleResources = Partial<Record<ModuleResourceType, any>>;

type ModuleDependencies = Record<string, ModuleResources>;

type ModuleComponentRefs = Record<string, boolean | string>;

type ModuleDescriptor = {
  name: string;
  imports?: string[];
  exports?: Partial<Record<ModuleResourceType, Record<string, any>>>;
  components?: ModuleComponentRefs;
};

export {
  ModuleResourceType,
  ModuleResources,
  ModuleDependencies,
  ModuleComponentRefs,
  ModuleDescriptor,
};
