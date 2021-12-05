export default {
  name: 'otaku',
  path: '/otaku',
  redirect: '/otaku/animations',
  routes: [
    {
      name: 'animationList',
      path: '/otaku/animations',
      component: '@/domain/animation/views/animation-list/index',
    },
  ],
};
