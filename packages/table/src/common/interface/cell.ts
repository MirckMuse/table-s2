import { Sheet } from "../../sheet";
import { SimpleBBox } from "./bbox";
import { Position } from "./interaction";
import { Column, RowData } from "./sheet";
import { Cell, ColCell, DataCell } from '../../cell'
import { ColumnHeaderMeta } from "./header";

export interface BaseViewMeta extends SimpleBBox {
  column: Column;
}

export interface ViewMeta extends BaseViewMeta {
  sheet: Sheet;

  record: RowData | null;

  rowIndex: number;
}

export interface ColViewMeta extends BaseViewMeta {
  sheet: Sheet;

  parent: ColViewMeta | null;

  isLeaf: boolean;

  deep: number;

  children?: ColViewMeta[];

  belongsCell?: Cell | null | undefined;
}


export interface FormattedResult {
  formattedText: string;

  value: string | number;
}

export enum CellType {
  DATA_CELL = 'data_cell',
  COL_CELL = 'col_cell',
  SERIES_NUMBER_CELL = 'series_number_cell',
  MERGED_CELL = 'merged_cell',
}

export enum CellBorderPosition {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum CellBoxSizing {
  BORDER_BOX = 'border-box',
  PADDING_BOX = 'padding-box',
  CONTENT_BOX = 'content-box',
}

export interface BackgoundColor {
  backgroundColor?: string;
  backgroundColorOpacity?: number;
  intelligentReverseTextColor?: boolean;
}

export enum IconPosition {
  Left = 'left',
  Right = 'right'
}

type IconPositionValue = `${IconPosition}`

export interface IconConfig {
  name: string;
  // TODO:
}

export type CellIcons = {
  [key in IconPositionValue]?: IconConfig[];
}

export type CellIconPosition = {
  [key in IconPositionValue]?: Position;
}

// 单元格交互类型
export enum CellInteractiveType {
  Background = "interactive_background",
  Border = "interactive_border"
}

export interface ColCellConfig {
  override?: (sheet: Sheet, meta: ColViewMeta, headerMeta: ColumnHeaderMeta) => ColCell;
}

export interface DataCellConfig {
  override?: (sheet: Sheet, meta: ViewMeta) => DataCell;

  height?: number;

  width?: number;
}
