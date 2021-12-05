import otaku from './otaku';

export default [
  {
    name: 'root',
    path: '/',
    /* redirect:'/otaku' */ component: '@/domain/animation/views/animation-list/index',
  },
  otaku,
];
