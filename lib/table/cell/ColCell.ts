import { BaseHeaderConfig, ColCell } from '@antv/s2';
import { ITableColumn } from '../typing';

function pickStyle(column?: ITableColumn) {
  if (!column) return {}

  return {
    textAlign: column.align
  }
}

export default class TableColCell extends ColCell {

  protected columnMeta: Record<string, ITableColumn> = {};

  /**
   * @param 
   */
  protected handleRestOptions(...[conf]: [BaseHeaderConfig & { columnMeta: Record<string, ITableColumn> }]): void {
    super.handleRestOptions(conf)
    this.columnMeta = conf.columnMeta
  }

  getTextStyle() {
    return {
      ...super.getTextStyle(),
      ...pickStyle(this.columnMeta[this.meta.field])
    }
  }
}