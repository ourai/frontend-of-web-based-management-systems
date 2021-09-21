import { ViewDescriptor } from '@/types';

import EpisodesField from './EpisodesField.vue';

export default {
  name: 'AnimationDetailView',
  category: 'object',
  widget: 'DetailViewWidget',
  fields: ['title', 'description', 'form', { name: 'episodes', widget: EpisodesField }],
} as ViewDescriptor;
