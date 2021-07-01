import { createFormView } from 'handie-vue';

import context from '../../context';

export default createFormView(context, {
  fields: [
    { name: 'title', label: '标题' },
    { name: 'description', label: '简介' },
    { name: 'episodes', label: '剧集' },
  ],
  getOne: 'getAnimationById',
});
