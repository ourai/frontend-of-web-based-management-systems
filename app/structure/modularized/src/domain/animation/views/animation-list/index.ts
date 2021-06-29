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
    { text: '新增', context: 'free', config: { primary: true } },
    { text: '批量删除', context: 'batch', config: { danger: true } },
    { text: '查看' },
    { text: '编辑' },
    { text: '删除', config: { danger: true } },
  ],
  getList: 'getAllAnimationList',
  config: {
    hidePagination: true,
  },
});
