import { ColViewMeta } from "./cell";

export interface LayoutInfo {
  colCellMetas: ColViewMeta[];

  colCellLeafNodes: ColViewMeta[];

  seriesNumberNodes?: ColViewMeta[];
}

// 
export type ViewCellWidths = Record<string, number>;

export type ViewCellHeights = {
  // 获取所有单元格的高度
  getTotalHeight(): number;

  // 获取所有单元格的行数量
  getTotalLength(): number;

  // 根据偏移的行数来获取总偏移高度。
  getCellOffsetY(offsetLength: number): number;

  // 根据可视范围的Y坐标计算出来需要渲染的行数据范围
  getIndexRange(startY: number, endY: number): { start: number, end: number };
};

export type Indexes = [RowIndex, RowIndex, DataIndex[]];

export type PanelIndexes = {
  center: Indexes;

  frozenCol?: Indexes;

  frozenTrailingCol?: Indexes;
};

export type RowIndex = number;

export type DataIndex = string;

export type DiffItem = [RowIndex, DataIndex];

export interface Diff {
  add: DiffItem[];
  remove: DiffItem[];
}