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
      :current-page="pageNum"
      :page-size="pageSize"
      :total="total"
      v-bind="tableProps"
      @selection-change="handleSelectionChange"
      @current-change="handlePageNumChange"
      @size-change="handlePageSizeChange"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { Pagination, ListViewContext, resolveViewContextInAction } from 'handie-vue';

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

  private pageNum: number = 1;

  private pageSize: number = 20;

  private total: number = 0;

  private busy: boolean = false;

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

  public fetchDataSource(
    pagination: Pagination = { pageNum: this.pageNum, pageSize: this.pageSize },
  ): void {
    this.busy = true;

    this.context
      .getList(pagination, (data, { pageNum, pageSize, total }) => {
        this.dataSource = data;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.total = total;
      })
      .finally(() => (this.busy = false));
  }

  private handleSelectionChange(selected: any[]) {
    this.selected = selected;
  }

  private handlePageNumChange(pageNum: number) {
    this.fetchDataSource({ pageNum, pageSize: this.pageSize });
  }

  private handlePageSizeChange(pageSize: number) {
    this.fetchDataSource({ pageNum: this.pageNum, pageSize });
  }

  private created(): void {
    this.tableProps = resolveTableProps(this.context, this.accessible);

    this.context.attach(this);
    this.fetchDataSource();
  }
}
</script>

<style lang="scss" src="./style.scss" scoped></style>
