type ModuleDescriptor = {
  name: string;
  imports?: string[];
  exports?: {
    [key in 'services' | 'utils' | 'widgets']?: Record<string, any>;
  };
};

export { ModuleDescriptor };
