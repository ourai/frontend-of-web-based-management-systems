<template>
  <div>Comic list view, {{ testUtil() }}</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { getDependencies } from '@/utils/module';

@Component
export default class ComicList extends Vue {
  private readonly testUtil = getDependencies('comic').animation.utils.test;
}
</script>
