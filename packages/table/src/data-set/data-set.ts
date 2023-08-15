import { BackendSorterParam, Column, DataConfig, Filter, FrontendSorterParam, RowData, SorterParam, ViewMeta } from "../common/interface";
import type { Sheet } from "../sheet";

export abstract class DataSet {
  protected columns: Column[];

  protected lastColumns: Column[];

  protected originData: RowData[];

  protected sheet: Sheet;

  protected backendSorters: BackendSorterParam[];

  protected frontendSorters: FrontendSorterParam[];

  protected filters: Filter[];

  displayData: RowData[];

  constructor(sheet: Sheet) {
    this.sheet = sheet;
  }

  getLastColumns() {
    return this.lastColumns
  }

  setDataConfig(dataConfig: DataConfig) {
    const { columns, dataSource } = this.processDataConfig(dataConfig);

    this.columns = columns;
    this.lastColumns = this.processLastColumns(columns);
    this.originData = dataSource;
    this.displayData = ([] as RowData[]).concat(this.originData);
  }

  processLastColumns(columns: Column[]) {
    const lastColumns = [] as Column[];

    let cacheColumns = ([] as Column[]).concat(columns);

    while (cacheColumns.length) {
      const top = cacheColumns.shift();

      if (!top) {
        break;
      }

      if (top?.children?.length) {
        cacheColumns = top.children.concat(cacheColumns);
      } else {
        lastColumns.push(top)
      }
    }

    return lastColumns
  }

  getDisplayDataSet() {
    return this.displayData;
  }

  /**
   *  ============= 抽象方法 ================
   */
  abstract processDataConfig(dataConfig: DataConfig): DataConfig;

  abstract getRowData(viewMeta: ViewMeta): RowData;
}