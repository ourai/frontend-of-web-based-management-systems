<template>
  <data-table :data="dataSource" :columns="columns" v-bind="config" />
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';

import { ListViewContext } from '@/types/context';
import { TableColumn } from '@/types/table';

import { getComponents } from '../../context';
import { resolveTableColumns } from './helper';

@Component({
  components: getComponents(),
})
export default class TableView extends Vue {
  @Inject({ from: 'context', default: null })
  private readonly context!: ListViewContext<any>;

  private dataSource: any[] = [];

  private columns: TableColumn[] = [];

  private get config() {
    return this.context.getConfig();
  }

  private created(): void {
    const ctx = this.context;

    if (ctx) {
      this.columns = resolveTableColumns(ctx.getFields());
      ctx.getList({}, data => (this.dataSource = data));
    }
  }
}
</script>
