import { createModuleContext } from 'handie-vue';

import { MODULE_NAME } from './helper';
import repo from './repository';

export default createModuleContext(MODULE_NAME, repo);
