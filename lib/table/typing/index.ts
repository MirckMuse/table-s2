export * from './theme'
import { RawData } from '@antv/s2'

export type TableData = RawData & Record<string, unknown>;

export type Align = 'left' | 'center' | 'right';

// 列的冻结配置
export type ITableColumnFixed = boolean | 'left' | 'right';

/**
 * 列配置信息
 */
export interface ITableColumn {
  title: string;

  dataIndex: string;

  fixed?: ITableColumnFixed;

  align?: Align;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface ICellMeta {
  position: IPosition;

  size: ISize;
}