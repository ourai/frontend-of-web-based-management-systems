import App from '../App.vue';
import DemoHome from './Home.vue';
import demoRoutes from './routes';

const routes = {
  name: 'kokiri',
  path: '/kokiri',
  component: App,
  redirect: '/kokiri/home',
  children: [
    { path: 'home', name: 'home', component: DemoHome },
    ...demoRoutes.map(({ text, ...others }) => others),
  ],
};

export { routes, demoRoutes };
