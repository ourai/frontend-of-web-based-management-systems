import { createTableView } from '@/utils/context';

import context from '../../context';

import TitleField from './TitleField.vue';
import EpisodesField from './EpisodesField.vue';

export default createTableView(context, {
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
    { name: 'gotoCreateFormView', primary: true },
    'deleteList',
    'gotoDetailView',
    'gotoEditFormView',
    'deleteOne',
  ],
  getList: 'getAllAnimationList',
  config: {
    checkable: true,
    hidePagination: true,
  },
});
