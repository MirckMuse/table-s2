import EventEmitter from '@antv/event-emitter';

declare interface Column {
  key?: string;
  dataIndex: string;
  title: string;
}

/**
 * 通用配置
 */
declare interface Config {
  [key: string]: unknown;
}

declare interface DataConfig {
  dataSource: RowData[];
  columns: Column[];
  /**
   * 排序字段
   */
  sorters?: Sorter[];
  /**
   * 筛选字段
   */
  filters: Filter[];
}

export declare abstract class DataSet {
  protected columns: Column[];
  protected originData: RowData[];
  protected sheet: Sheet;
  protected sorters: Sorter[];
  protected filters: Filter[];
  protected displayData: RowData[];
  constructor(sheet: Sheet);
}

declare type Filter = any;

declare type MountElement = HTMLElement;

declare type RowData = Record<string, unknown>;

/**
 * 基础的表格
 */
export declare abstract class Sheet extends EventEmitter {
  dataConfig: DataConfig;
  config: Config;
  dataSet: DataSet;
  abstract getDataSet(): DataSet;
  constructor(dom: MountElement, dataConfig: DataConfig, config: Config);
}

declare type Sorter = any;

export declare class TableDataSet extends DataSet {
}

export declare class TableSheet extends Sheet {
  getDataSet(): DataSet;
}

export { }
