<template>
  <div class="TableView">
    <div class="TableView-tableActions" v-if="topActions.length > 0">
      <action-renderer
        :action="action"
        :context-getter="contextGetter"
        :key="action.text"
        v-for="action in topActions"
      />
    </div>
    <data-table
      class="TableView-dataTable"
      :data="dataSource"
      :columns="columns"
      v-bind="tableProps"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';

import { ListViewContext } from '@/types/context';
import { TableColumn } from '@/types/table';
import { resolveViewContextInAction } from '@/utils/context';

import { getComponents } from '../../context';
import ActionRenderer from '../action-renderer';
import { DataTableProps } from './typing';
import { resolveTableColumns, resolveTableProps } from './helper';

const components = getComponents();

components.ActionRenderer = ActionRenderer;

@Component({ components })
export default class TableView extends Vue {
  @Inject({ from: 'context', default: null })
  private readonly context!: ListViewContext<any>;

  private dataSource: any[] = [];

  private columns: TableColumn[] = [];

  private tableProps: DataTableProps = {};

  private get topActions() {
    return this.context.getActions().filter(({ context }) => context && context !== 'single');
  }

  private get contextGetter() {
    return () => ({ ...resolveViewContextInAction(this.context), getValue: () => this.dataSource });
  }

  private created(): void {
    const ctx = this.context;

    this.columns = resolveTableColumns(ctx);
    this.tableProps = resolveTableProps(ctx.getConfig());

    ctx.getList({}, data => (this.dataSource = data));
  }
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
