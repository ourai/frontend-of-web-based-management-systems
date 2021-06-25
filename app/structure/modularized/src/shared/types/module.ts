type ModuleResourceType = 'services' | 'utils' | 'widgets';

type ModuleComponentRefs = Record<string, boolean | string>;

type ModuleDescriptor = {
  name: string;
  imports?: string[];
  exports?: Partial<Record<ModuleResourceType, Record<string, any>>>;
  components?: ModuleComponentRefs;
};

export { ModuleResourceType, ModuleComponentRefs, ModuleDescriptor };
