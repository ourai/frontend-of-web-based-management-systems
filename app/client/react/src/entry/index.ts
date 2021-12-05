import { createApp } from 'handie-react';

import components from '@/shared/components';
import modules from '../domain';

createApp({
  components,
  metadata: { modules },
});
