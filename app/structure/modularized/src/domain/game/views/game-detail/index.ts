import { createDetailView } from '@/utils/view';

import context from '../../context';

export default createDetailView(context, {
  name: 'GameDetailView',
  fields: [
    { name: 'title', label: '标题' },
    { name: 'description', label: '简介' },
  ],
  getOne: 'getOneById',
});
