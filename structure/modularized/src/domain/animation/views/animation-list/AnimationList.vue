<template>
  <div class="AnimationList">Animation list view, {{ testUtil() }}<test-widget /></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { testUtil } from '../../helper';
import TestWidget from '../../widgets/test-widget';

@Component({
  components: { TestWidget },
})
export default class AnimationList extends Vue {
  private readonly testUtil = testUtil;
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
