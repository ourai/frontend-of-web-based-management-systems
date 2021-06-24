<template>
  <app-container class="AdminLayout">
    <layout-container>
      <layout-aside class="AdminLayout-sidebar">
        <router-link class="AdminLayout-brand" :to="{ name: 'root' }">中后台前端应用</router-link>
        <ul class="AdminLayout-menu">
          <li
            :class="{ 'is-active': nav.name === currentSubNav }"
            :key="nav.name"
            v-for="nav in subNavs"
          >
            <router-link :to="{ name: nav.name }">{{ nav | text }}</router-link>
          </li>
        </ul>
      </layout-aside>
      <layout-container>
        <layout-header>
          <nav class="AdminLayout-mainNav">
            <ul class="MainNav">
              <li
                class="MainNav-item"
                :class="{ 'is-active': nav.name === currentMainNav }"
                :key="nav.name"
                v-for="nav in mainNavs"
              >
                <router-link :to="{ name: nav.name }">{{ nav | text }}</router-link>
              </li>
            </ul>
          </nav>
        </layout-header>
        <layout-main>
          <router-view />
        </layout-main>
      </layout-container>
    </layout-container>
  </app-container>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import {
  App as AppContainer,
  LayoutContainer,
  LayoutHeader,
  LayoutMain,
  LayoutAside,
} from '@kokiri/components';

import { RouteConfig } from '@/types';

function isMenuShown({ meta }: RouteConfig): boolean {
  return !meta || meta.show !== false;
}

@Component({
  components: {
    AppContainer,
    LayoutContainer,
    LayoutHeader,
    LayoutMain,
    LayoutAside,
  },
  filters: {
    text: (route: RouteConfig) => (route.meta && route.meta.text) || route.name,
  },
})
export default class AdminLayout extends Vue {
  @Inject('routes')
  private readonly routes!: RouteConfig[];

  private get currentMainNav() {
    return this.$route.matched[0].name;
  }

  private get currentSubNav() {
    return this.$route.matched[1].name!;
  }

  private get mainNavs() {
    return this.routes.filter(route => route.name !== 'root' && isMenuShown(route));
  }

  private get subNavs() {
    const { matched } = this.$route;
    const mainNav = this.routes.find(route => route.name === matched[0].name);

    return mainNav && mainNav.children ? mainNav.children.filter(isMenuShown) : [];
  }
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
