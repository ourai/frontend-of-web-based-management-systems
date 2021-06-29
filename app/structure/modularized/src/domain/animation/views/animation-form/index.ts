import { createFormView } from '@/utils/context';

import context from '../../context';

export default createFormView(context, {
  fields: [
    { name: 'title', label: '标题' },
    { name: 'description', label: '简介' },
    { name: 'episodes', label: '集数' },
  ],
  getOne: 'getAnimationById',
});
