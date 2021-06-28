<template>
  <table-view />
</template>

<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator';

import context from './context';

@Component({
  components: context.getComponents(),
})
export default class AnimationList extends Vue {
  @Provide('context')
  private readonly context = context;
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
