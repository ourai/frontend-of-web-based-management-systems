import { ViewDescriptor } from '@/types';

import EpisodesField from './EpisodesField.vue';
import DescriptionField from './DescriptionField.vue';

export default {
  name: 'AnimationDetailView',
  category: 'object',
  widget: 'DetailViewWidget',
  fields: [
    'title',
    { name: 'description', widget: DescriptionField },
    'form',
    { name: 'episodes', widget: EpisodesField },
  ],
} as ViewDescriptor;
