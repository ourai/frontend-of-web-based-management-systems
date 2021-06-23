type ModuleResourceType = 'services' | 'utils' | 'widgets';

type ModuleComponentIdentifier = boolean | string;

type ModuleDescriptor = {
  name: string;
  imports?: string[];
  exports?: Partial<Record<ModuleResourceType, Record<string, any>>>;
  components?: Record<string, ModuleComponentIdentifier>;
};

export { ModuleResourceType, ModuleComponentIdentifier, ModuleDescriptor };
