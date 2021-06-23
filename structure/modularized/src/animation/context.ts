import { getComponent } from '@/utils/component';
import { createRepositoryExecutor } from '@/utils/context';

import { AnimationRepository } from './repository';

const components = {
  OlButton: getComponent('OlButton')!,
};

const execute = createRepositoryExecutor(new AnimationRepository());

export { components, execute };
