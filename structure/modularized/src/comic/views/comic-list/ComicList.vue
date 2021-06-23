<template>
  <div>Comic list view, {{ testUtil() }}<test-widget /></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { getDependencies, getComponents } from '@/utils/module';

@Component({
  components: getComponents('comic'),
})
export default class ComicList extends Vue {
  private readonly testUtil = (getDependencies('comic', 'animation.utils') as any).test;
}
</script>
