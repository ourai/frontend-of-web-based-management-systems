import { createModuleContext } from '@/utils/context';

import { MODULE_NAME } from './helper';
import { AnimationRepository } from './repository';

export default createModuleContext(MODULE_NAME, new AnimationRepository());
