import type { DataSet } from '../data-set';
import { Sheet } from './sheet'
import { TableDataSet } from '../data-set'
import { TableFacet } from '../facet'

export class TableSheet extends Sheet {
  protected bindEvents(): void {
  }

  protected initFacet() {
    this.facet?.destroy()
    this.facet = this.config.facet?.(this) ?? new TableFacet(this)
    this.facet.render()
  }

  public getDataSet(): DataSet {
    return new TableDataSet(this)
  }
}