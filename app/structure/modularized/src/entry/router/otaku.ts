import { RouteConfig } from '@/types';

import { AnimationList, AnimationForm } from '../../domain/animation/views';
import { ComicList } from '../../domain/comic/views';
import { GameList } from '../../domain/game/views';
import { NovelList } from '../../domain/novel/views';

import AdminLayout from '../layouts/admin';

export default {
  name: 'otaku',
  path: '/otaku',
  component: AdminLayout,
  meta: { text: '宅文化', auth: 'otaku' },
  redirect: '/otaku/animations',
  children: [
    {
      name: 'animationList',
      path: 'animations',
      component: AnimationList,
      meta: { text: '动画', auth: 'animationList' },
    },
    {
      name: 'animationNewForm',
      path: 'animations/new',
      component: AnimationForm,
      meta: { text: '新建动画', show: false },
    },
    {
      name: 'animationEditForm',
      path: 'animations/:id/edit',
      component: AnimationForm,
      meta: { text: '编辑动画', show: false },
    },
    { name: 'comicList', path: 'comics', component: ComicList, meta: { text: '漫画' } },
    { name: 'gameList', path: 'games', component: GameList, meta: { text: '游戏' } },
    { name: 'novelList', path: 'novels', component: NovelList, meta: { text: '小说' } },
  ],
} as RouteConfig;
