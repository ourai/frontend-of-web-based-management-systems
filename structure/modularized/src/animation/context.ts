import { createRepositoryExecutor } from '@/utils/view';

import { AnimationRepository } from './repository';

const execute = createRepositoryExecutor(new AnimationRepository());

export { execute };
