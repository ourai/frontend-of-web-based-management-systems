import { createDetailView } from '@/utils/view';

import context from '../../context';

export default createDetailView(context, {
  fields: [
    { name: 'title', label: '标题' },
    { name: 'description', label: '简介' },
    { name: 'episodes', label: '剧集' },
  ],
  getOne: 'getAnimationById',
});
