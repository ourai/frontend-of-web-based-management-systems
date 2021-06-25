import { RouteConfig } from '@/types';

import { NavMenu } from './typing';

function resolveAvailableNavs(
  accessible: Record<string, boolean>,
  routes: RouteConfig[],
): NavMenu[] {
  const resolved: NavMenu[] = [];

  routes.forEach(({ name = '', meta = {}, children }) => {
    if (name === 'root' || meta.show === false || !(!meta.auth || accessible[meta.auth])) {
      return;
    }

    const nav: NavMenu = { name, text: meta.text || '', icon: meta.icon };

    if (children && children.length > 0) {
      nav.children = resolveAvailableNavs(accessible, children);

      if (nav.children.length === 0) {
        return;
      }
    }

    resolved.push(nav);
  });

  return resolved;
}

export { resolveAvailableNavs };
