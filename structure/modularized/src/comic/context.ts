import { createModuleContext } from '@/utils/context';

import { MODULE_NAME } from './helper';
import { ComicRepository } from './repository';

export default createModuleContext(MODULE_NAME, new ComicRepository());
