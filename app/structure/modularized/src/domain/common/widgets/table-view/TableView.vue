<template>
  <div class="TableView">
    <div class="TableView-tableActions" v-if="topActions.length > 0">
      <action-renderer :action="action" :key="action.text" v-for="action in topActions" />
    </div>
    <data-table class="TableView-dataTable" :data="dataSource" :columns="columns" v-bind="config" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';

import { ListViewContext } from '@/types/context';
import { TableColumn } from '@/types/table';

import { getComponents } from '../../context';
import ActionRenderer from '../action-renderer';
import { resolveTableColumns } from './helper';

const components = getComponents();

components.ActionRenderer = ActionRenderer;

@Component({ components })
export default class TableView extends Vue {
  @Inject({ from: 'context', default: null })
  private readonly context!: ListViewContext<any>;

  private dataSource: any[] = [];

  private columns: TableColumn[] = [];

  private get config() {
    return this.context.getConfig();
  }

  private get topActions() {
    return this.context.getActions().filter(({ context }) => context && context !== 'single');
  }

  private created(): void {
    const ctx = this.context;

    if (ctx) {
      this.columns = resolveTableColumns(ctx);
      ctx.getList({}, data => (this.dataSource = data));
    }
  }
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
