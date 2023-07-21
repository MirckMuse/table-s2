import type { InteractionConfig } from "./interaction";
import type { AdaptiveConfig, HdAdapterConfig } from "./ui";
import type { Sheet } from "../../sheet";
import type { Facet } from "../../facet";

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

/**
 * 通用配置
 */
export interface Config {
  // 是否开启对 css transform 的支持
  supportsCSSTransform?: boolean;

  // 交互配置
  interaction?: InteractionConfig;

  // 高清适配器
  hdAdapter?: boolean | HdAdapterConfig;

  // 自适应配置。
  adaptive?: boolean | AdaptiveConfig;

  facet?: (sheet: Sheet) => Facet;

  pagination?: Pagination;

  [key: string]: unknown;
}

