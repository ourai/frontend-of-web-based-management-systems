import { RouteConfig as _RouteConfig } from 'vue-router';

type RouteMeta = {
  text?: string;
  icon?: string;
  show?: boolean;
  auth?: string;
};

type RouteConfig = Omit<_RouteConfig, 'meta' | 'children'> & {
  children?: RouteConfig[];
  meta?: RouteMeta;
};

export { RouteMeta, RouteConfig };
