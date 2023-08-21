import type { InteractionConfig } from "./interaction";
import type { AdaptiveConfig, HdAdapterConfig } from "./ui";
import type { Sheet } from "../../sheet";
import type { Facet } from "../../facet";
import { ColCellConfig, DataCellConfig } from "./cell";
import { DataIndex } from "./facet";

export type RowData = Record<string, unknown>;

export type ColumnCustomCellOption = {
  record: RowData | null,

  index: number,

  column: Column
};

export type ColumnCustomRenderOption = ColumnCustomCellOption & {
  text: string | number,
}

export type ColumnEllipsis = boolean | {
  showTitle?: boolean;
}

// 列自定义渲染函数
export type ColumnCustomRender = (option: ColumnCustomRenderOption) => string | number;

export type MountElement = HTMLElement;

// 列自定义绑定事件
export type ColumnCustomCellResult = {
  style?: CSSStyleDeclaration;

  onClick?: () => void;

  // TODO:
}

export type ColumnCustomHeaderResult = ColumnCustomCellResult & {
}

export type ColumnCustomCell = (option: ColumnCustomCellOption) => ColumnCustomCellResult;

export type ColumnCustomHeaderCell = (column: Column) => ColumnCustomHeaderResult;

export interface Column {
  key?: string;

  dataIndex: string;

  title: string | (() => string);

  children?: Column[];

  customRender?: ColumnCustomRender;

  customCell?: ColumnCustomCell;

  customHeaderCell?: ColumnCustomHeaderCell;

  // sortOrder  > sorter > defaultSortOrder
  defaultSortOrder?: SortOrder;

  sorter?: SorterFunction | boolean;

  sortOrder?: SortOrder | null;

  onFilter?: ColumnFilter;

  width?: number;

  minWidth?: number;

  maxWidth?: number;

  ellipsis?: ColumnEllipsis;
}

export type ColumnFilter = (rowData: RowData, index: number, originDatas: RowData[]) => boolean;

export type SorterFunction = (pre: RowData, current: RowData) => number;

export enum SortOrder {
  Ascend = 'ascend',
  Descend = 'descend'
}

export type Sorter = SorterFunction | boolean;

export type SorterParam = {
  sorter: Sorter,

  order: SortOrder | null
};

export type BackendSorterParam = {
  sorter: DataIndex,

  order: SortOrder | null
}

export type FrontendSorterParam = {
  sorter: SorterFunction | DataIndex,

  order: SortOrder | null,

  defaultOrder?: SortOrder | null,
}

export type Filter = ColumnFilter;

export interface DataConfig {

  dataSource: RowData[];


  columns: Column[];

  /**
   * 筛选字段
   */
  filters?: Filter[];
}

export interface Pagination {
  /** 每页数量 */
  pageSize: number;

  /** 当前页 (从 1 开始) */
  current: number;

  /** 数据总条数 */
  total?: number;
}

export interface TransformCellTextOptions {
  column: Column;

  record: unknown;

  rowIndex: number;
}

export type TransformCellText = string | number | ((options: TransformCellTextOptions) => string | number);

/**
 * 通用配置
 */
export interface Config {
  layout?: LayoutType;

  // 是否开启对 css transform 的支持
  supportsCSSTransform?: boolean;

  // 交互配置
  interaction?: InteractionConfig;

  // 高清适配器
  hdAdapter?: boolean | HdAdapterConfig;

  // 自适应配置。
  adaptive?: boolean | AdaptiveConfig;

  colCell?: ColCellConfig;

  dataCell?: DataCellConfig;

  facet?: (sheet: Sheet) => Facet;

  pagination?: Pagination;

  transformCellText?: TransformCellText;

  [key: string]: unknown;
}

export enum LayoutType {
  Adaptive = 'adaptive',
  Compact = 'compact',
}