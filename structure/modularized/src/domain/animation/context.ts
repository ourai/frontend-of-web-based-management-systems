import {
  createModuleContext,
  createListViewContextFactory,
  createObjectViewContextFactory,
} from '@/utils/context';

import { MODULE_NAME } from './helper';
import repo from './repository';

const moduleContext = createModuleContext(MODULE_NAME, repo);
const createListViewContext = createListViewContextFactory(moduleContext);
const createObjectViewContext = createObjectViewContextFactory(moduleContext);

export { createListViewContext, createObjectViewContext, moduleContext as default };
