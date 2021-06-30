<template>
  <div class="TableView">
    <div class="TableView-search" v-if="searchable">
      <search-renderer />
    </div>
    <div class="TableView-tableActions" v-if="topActions.length > 0">
      <action-renderer
        :action="action"
        :context-getter="contextInActionGetter"
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
import SearchRenderer from '../search-renderer';
import ActionRenderer from '../action-renderer';
import { DataTableProps } from './typing';
import { isActionsAuthorized, resolveAuthorizedActions, resolveTableProps } from './helper';

const components = getComponents();

components.SearchRenderer = SearchRenderer;
components.ActionRenderer = ActionRenderer;

@Component({ components })
export default class TableView extends Vue {
  @Inject({ from: 'context', default: null })
  private readonly context!: ListViewContext;

  private dataSource: any[] = [];

  private selected: any[] = [];

  private tableProps: DataTableProps = {} as any;

  private get searchable() {
    return !!this.context.getSearch();
  }

  private get accessible() {
    return this.$store.state.session.authority.accessible;
  }

  private get topActions() {
    return isActionsAuthorized(this.context.getActionsAuthority(), this.accessible)
      ? resolveAuthorizedActions(
          this.context.getActions().filter(({ context }) => context && context !== 'single'),
          this.context.getActionsAuthority(),
          this.accessible,
        )
      : [];
  }

  private get contextInActionGetter() {
    return () => ({ ...resolveViewContextInAction(this.context), getValue: () => this.selected });
  }

  private handleSelectionChange(selected: any[]): void {
    this.selected = selected;
  }

  private created(): void {
    const ctx = this.context;

    this.tableProps = resolveTableProps(ctx, this.accessible);

    ctx.getList({}, data => (this.dataSource = data));
  }
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
