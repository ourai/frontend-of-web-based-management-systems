import { TableColumn } from '@/types/table';

import { createListViewContext } from '../../context';

const context = createListViewContext({
  fields: [
    { name: 'title', label: '标题', config: { width: '300' } },
    { name: 'description', label: '简介' },
    { name: 'episodes', label: '集数', config: { width: '60', align: 'center' } },
  ],
  getList: 'getAllAnimationList',
});

const columns: TableColumn[] = [
  {
    label: '标题',
    prop: 'title',
    width: '300',
    render: (h, { row }) =>
      h(
        'a',
        {
          attrs: { href: `https://otaku.ourai.ws/animations/${row.id}/`, target: '_blank' },
        },
        row.title,
      ),
  },
  { label: '简介', prop: 'description' },
  {
    label: '集数',
    prop: 'episodes',
    width: '60',
    align: 'center',
    render: (h, { row }) => h('span', (row.episodes || []).length),
  },
];

export { context as default };
