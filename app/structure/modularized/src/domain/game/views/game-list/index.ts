import { createTableView } from '@/utils/view';

import context from '../../context';

import TitleField from './TitleField.vue';

export default createTableView(context, {
  name: 'GameListView',
  fields: [
    { name: 'title', label: '标题', render: TitleField, config: { width: '300' } },
    { name: 'description', label: '简介' },
  ],
  actions: [
    { name: 'gotoCreateFormView', authority: 'game:edit', primary: true },
    { name: 'deleteList', authority: 'game:edit' },
    'gotoDetailView',
    { name: 'gotoEditFormView', authority: 'game:edit' },
    { name: 'deleteOne', authority: 'game:edit' },
  ],
  config: { checkable: true, operationColumnWidth: 250 },
  getList: 'getList',
});
