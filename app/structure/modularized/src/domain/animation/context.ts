import { createModuleContext } from '@/utils/context';

import { MODULE_NAME } from './helper';
import repo from './repository';

export default createModuleContext(MODULE_NAME, repo);
