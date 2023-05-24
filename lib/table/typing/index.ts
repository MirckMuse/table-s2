export * from './theme'

export type TableData = Record<string, unknown>;

/**
 * 列配置信息
 */
export interface ITableColumn {
  title: string;

  dataIndex: string;
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