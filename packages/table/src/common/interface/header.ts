import { ColViewMeta } from "./cell";
import { Position } from "./interaction";

export interface BaseHeaderMeta {
  scrollX?: number;

  scrollY?: number;

  width: number;

  height: number;

  position: Position;

  colCellMetas: ColViewMeta[];
}

// rome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface ColumnHeaderMeta extends BaseHeaderMeta {
}