import type { DataSet } from '../data-set';
import { Sheet } from './sheet'
import { TableDataSet } from '../data-set'

export class TableSheet extends Sheet {

  public getDataSet(): DataSet {
    return new TableDataSet(this)
  }
}