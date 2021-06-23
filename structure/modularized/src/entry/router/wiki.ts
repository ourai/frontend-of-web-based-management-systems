import { RouteConfig } from 'vue-router';

import AdminLayout from '../layouts/AdminLayout.vue';
import AnimationList from '../../animation/views/animation-list/AnimationList.vue';
import ComicList from '../../comic/views/comic-list/ComicList.vue';

export default {
  name: 'wiki',
  path: '/wiki',
  component: AdminLayout,
  redirect: '/wiki/animations',
  children: [
    { name: 'animation', path: 'animations', component: AnimationList },
    { name: 'comic', path: 'comics', component: ComicList },
  ],
} as RouteConfig;
