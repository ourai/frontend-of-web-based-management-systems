<template>
  <router-view />
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';

import { RouteConfig } from '@/types';

@Component
export default class AdminLayout extends Vue {
  @Inject('routes')
  private readonly routes!: RouteConfig[];

  private created(): void {
    console.log('routes: ', this.routes, this.$route);
  }
}
</script>
