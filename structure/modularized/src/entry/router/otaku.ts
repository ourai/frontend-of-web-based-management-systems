import { RouteConfig } from '@/types';

import { AnimationList, AnimationForm } from '../../domain/animation/views';
import { ComicList } from '../../domain/comic/views';
import { GameList } from '../../domain/game/views';
import { NovelList } from '../../domain/novel/views';

import AdminLayout from '../layouts/AdminLayout.vue';

export default {
  name: 'otaku',
  path: '/otaku',
  component: AdminLayout,
  redirect: '/otaku/animations',
  children: [
    { name: 'animationList', path: 'animations', component: AnimationList },
    { name: 'animationNewForm', path: 'animations/new', component: AnimationForm },
    { name: 'animationEditForm', path: 'animations/:id/edit', component: AnimationForm },
    { name: 'comic', path: 'comics', component: ComicList },
    { name: 'game', path: 'games', component: GameList },
    { name: 'novel', path: 'novels', component: NovelList },
  ],
} as RouteConfig;
