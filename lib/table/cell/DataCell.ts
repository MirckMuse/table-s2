import { DataCell } from '@antv/s2'
import { ITableColumn } from '../typing'

function pickStyle(column?: ITableColumn) {
  if (!column) return {}

  return {
    textAlign: column.align
  }
}

export default class TableDataCell extends DataCell {

  protected columnMeta: Record<string, ITableColumn> = {};

  protected handleRestOptions(...[columnMeta]: [Record<string, ITableColumn>]) {
    this.columnMeta = columnMeta
  }

  getTextStyle() {
    return {
      ...super.getTextStyle(),
      ...pickStyle(this.columnMeta[this.meta.valueField])
    }
  }
}