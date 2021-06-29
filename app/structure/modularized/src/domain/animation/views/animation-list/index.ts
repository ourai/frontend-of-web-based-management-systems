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
    {
      text: '新增',
      context: 'free',
      primary: true,
      execute: (_, vm) => vm.$router.push({ name: 'animationNewForm' }),
    },
    { text: '批量删除', context: 'batch', danger: true },
    { text: '查看' },
    {
      text: '编辑',
      execute: (_, vm) => vm.$router.push({ name: 'animationEditForm', params: { id: 'genius' } }),
    },
    { text: '删除', danger: true },
  ],
  getList: 'getAllAnimationList',
  config: {
    hidePagination: true,
  },
});
