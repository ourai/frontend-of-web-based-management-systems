import { RouteConfig } from 'vue-router';

import AnimationList from '../../animation/views/animation-list/AnimationList.vue';
import ComicList from '../../comic/views/comic-list/ComicList.vue';
import GameList from '../../game/views/game-list/GameList.vue';
import NovelList from '../../novel/views/novel-list/NovelList.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

export default {
  name: 'otaku',
  path: '/otaku',
  component: AdminLayout,
  redirect: '/otaku/animations',
  children: [
    { name: 'animation', path: 'animations', component: AnimationList },
    { name: 'comic', path: 'comics', component: ComicList },
    { name: 'game', path: 'games', component: GameList },
    { name: 'novel', path: 'novels', component: NovelList },
  ],
} as RouteConfig;
