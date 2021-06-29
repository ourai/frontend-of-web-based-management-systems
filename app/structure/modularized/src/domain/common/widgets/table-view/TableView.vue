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
      v-bind="tableProps"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';

import { ListViewContext } from '@/types/context';
import { resolveViewContextInAction } from '@/utils/context';

import { getComponents } from '../../context';
import ActionRenderer from '../action-renderer';
import { DataTableProps } from './typing';
import { resolveTableProps } from './helper';

const components = getComponents();

components.ActionRenderer = ActionRenderer;

@Component({ components })
export default class TableView extends Vue {
  @Inject({ from: 'context', default: null })
  private readonly context!: ListViewContext<any>;

  private dataSource: any[] = [];

  private selected: any[] = [];

  private tableProps: DataTableProps = {} as any;

  private get topActions() {
    return this.context.getActions().filter(({ context }) => context && context !== 'single');
  }

  private get contextGetter() {
    return () => ({ ...resolveViewContextInAction(this.context), getValue: () => this.selected });
  }

  private handleSelectionChange(selected: any[]): void {
    this.selected = selected;
  }

  private created(): void {
    const ctx = this.context;

    this.tableProps = resolveTableProps(ctx);

    ctx.getList({}, data => (this.dataSource = data));
  }
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
