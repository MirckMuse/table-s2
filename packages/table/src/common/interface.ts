export type RowData = Record<string, unknown>;

export type MountElement = HTMLElement;

export interface Column {
  key?: string;

  dataIndex: string;

  title: string;
}

export type Sorter = any;

export type Filter = any;

export interface DataConfig {

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

/**
 * 通用配置
 */
export interface Config {
  [key: string]: unknown;
}

