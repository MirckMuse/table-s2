import { S2Table } from '../table';
import { ICellMeta } from '../typing';
import { merge } from 'lodash-es'

/**
 * 基础单元格
 */
export default abstract class BaseCell {
  protected table: S2Table;
  protected meta: ICellMeta | null = null;

  constructor(table: S2Table, meta: ICellMeta) {
    this.table = table
    this.meta = meta
  }

  getMeta() {
    return this.meta
  }

  setMeta(meta: ICellMeta) {
    this.meta = meta
  }

  mergeMeta(meta: Partial<ICellMeta>) {
    this.meta = merge(this.meta, meta)
  }

  public abstract render(): void;
}