import { createTableView } from '@/utils/view';

import context from '../../context';

import Search from './Search.vue';
import TitleField from './TitleField.vue';
import EpisodesField from './EpisodesField.vue';

export default createTableView(context, {
  search: Search,
  fields: [
    { name: 'title', label: '标题', render: TitleField, config: { width: '300' } },
    { name: 'description', label: '简介' },
    {
      name: 'episodes',
      label: '集数',
      render: EpisodesField,
      config: { width: '60', align: 'center' },
    },
  ],
  actions: [
    { name: 'gotoCreateFormView', authority: 'animation:edit', primary: true },
    { name: 'deleteList', authority: 'animation:edit' },
    'gotoDetailView',
    { name: 'gotoEditFormView', authority: 'animation:edit' },
    { name: 'deleteOne', authority: 'animation:edit' },
  ],
  getList: 'getAllAnimationList',
  config: {
    checkable: true,
    hidePagination: true,
  },
});
