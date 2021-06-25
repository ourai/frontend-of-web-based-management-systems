<template>
  <data-table :data="dataSource" :columns="columns" hide-pagination />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { AnimationEntity } from '../../typing';
import context, { columns } from './context';

@Component({
  components: context.getComponents(),
})
export default class AnimationList extends Vue {
  private readonly columns = columns;

  private dataSource: AnimationEntity[] = [];

  private created(): void {
    context.getList({}, data => (this.dataSource = data));
  }
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
