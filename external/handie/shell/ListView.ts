import { Component } from 'vue-property-decorator';

import { ListViewContext } from '../typing';
import ViewWidget from './View';

@Component
export default class ListViewWidget extends ViewWidget<ListViewContext> {
  protected dataSource: any[] = [];

  protected loading: boolean = false;

  protected pageNum: number = 1;

  protected pageSize: number = 20;

  protected total: number = 0;

  protected created(): void {
    this.on({
      busyChange: busy => (this.loading = busy),
      dataChange: dataSource => (this.dataSource = dataSource),
      totalChange: total => (this.total = total),
      currentPageChange: pageNum => (this.pageNum = pageNum),
      pageSizeChange: pageSize => (this.pageSize = pageSize),
    });
  }
}
