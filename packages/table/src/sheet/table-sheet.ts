import type { DataSet } from '../data-set';
import { Sheet } from './sheet'
import { TableDataSet } from '../data-set'
import { TableFacet } from '../facet'

export class TableSheet extends Sheet {
  protected bindEvents(): void {
  }
  protected initFacet(): TableFacet {
    return new TableFacet(this)
  }

  public getDataSet(): DataSet {
    return new TableDataSet(this)
  }
}