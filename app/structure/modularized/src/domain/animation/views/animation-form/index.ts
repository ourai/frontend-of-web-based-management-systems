import { ObjectViewContextDescriptor } from '@/types';

import AnimationForm from './AnimationForm.vue';

export default {
  name: 'AnimationFormView',
  category: 'object',
  widget: AnimationForm,
  fields: [
    { name: 'title', hint: '哈哈' },
    'description',
    'form',
    'episodes',
    { name: 'ghost', label: '幽灵', hidden: true },
  ],
  validate: 'submit',
} as ObjectViewContextDescriptor;
